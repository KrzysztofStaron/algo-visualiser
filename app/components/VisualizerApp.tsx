"use client";

import { FunctionComponent, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import SpeedModulator from "./SpeedModulator";
import { arrayHistory, groupHistory, indexHistory, createArrayHandler } from "./visualizers/array/ArrayComponent";
import { createLabelHandler, labelHistory } from "./visualizers/label/LabelComponent";
import { createStackHandler, stackHistory } from "./visualizers/stack/StackComponent";
import { createTreeHandler, treeHis, TreeNodeHandler } from "./visualizers/tree/TreeComponent";
import {
  createMatrixHandler,
  matrixColorHistory,
  matrixGroupHistory,
  matrixHistory,
  resetMatrix,
} from "./visualizers/matrix/MatrixComponent";

const MonacoEditor = dynamic(() => import("./MonacoEditor"), { ssr: false });

type ComponentData = {
  type: ComponentType;
  id: number;
  metadata: any;
  reactComponent: FunctionComponent<any>;
};

export let resetFunctions: CallableFunction[] = [];
export let syncFunctions: CallableFunction[] = [];

export var ids: ComponentData[] = [];

class TreeNode extends TreeNodeHandler {}

export enum ComponentType {
  BASE = "Base",
  ARRAY = "Array",
  LABEL = "Label",
  MATRIX = "Matrix",
  STACK = "Stack",
  TREE = "Tree",
}

const reset = () => {
  ids = [];

  // for some reason it must be reseted manually
  resetMatrix();

  resetFunctions.forEach(lambda => {
    lambda();
  });
};

export const sync = () => {
  const maxLen = calcLen();
  console.log(`sync(), maxLen: ${maxLen}`);

  syncFunctions.forEach(lambda => {
    lambda(maxLen);
  });
};

const calcLen = () => {
  let max = 0;

  for (let i of ids.filter(e => e.type === ComponentType.ARRAY).map(e => e.id)) {
    max = Math.max(max, arrayHistory[i].length, groupHistory[i].length, indexHistory[i].length);
  }

  for (let i of ids.filter(e => e.type === ComponentType.LABEL).map(e => e.id)) {
    max = Math.max(max, labelHistory[i].length);
  }

  for (let id of ids.filter(e => e.type === ComponentType.MATRIX).map(e => e.id)) {
    max = Math.max(
      max,
      matrixHistory[id].length ?? 0,
      matrixColorHistory[id].length ?? 0,
      matrixGroupHistory[id].length ?? 0
    );
  }

  for (let id of ids.filter(e => e.type === ComponentType.STACK).map(e => e.id)) {
    max = Math.max(max, stackHistory[id].length ?? 0);
  }

  for (let id of ids.filter(e => e.type === ComponentType.TREE).map(e => e.id)) {
    max = Math.max(max, treeHis[id].length ?? 0);
  }

  return max;
};

export const destructValue = (lambda: any) => {
  if (typeof lambda === "function") {
    return lambda();
  }

  return lambda;
};

// Quality of life, so user don't have to provide root as an argument
const createArray = (metadata?: any) => {
  return createArrayHandler(register, metadata ?? "");
};

const createLabel = (metadata: any) => {
  return createLabelHandler(register, metadata ?? "");
};

const createMatrix = (metadata: any) => {
  return createMatrixHandler(register, metadata ?? "");
};

const createStack = (metadata: any) => {
  return createStackHandler(register, metadata ?? "");
};

const createTree = (metadata: any) => {
  return createTreeHandler(register, metadata ?? "");
};

const register = (component: ComponentType, reactComponent: FunctionComponent<any>, metadata?: any) => {
  const id = ids.filter(e => e.type === component).length;
  console.log({ component: component, index: ids.length, id: id, reactComponent: reactComponent });

  ids.push({ type: component, id: id, metadata: metadata ?? {}, reactComponent: reactComponent });
  return id;
};

export default function VisualizerApp() {
  const [code, setCode] = useState(`const tree = createTree()

const t = new TreeNode("root");
t.add([1, [2, 3]])
t.add(new TreeNode(6))
t.add(new TreeNode(8))

tree.content(t)

t.add(9)

tree.content(t)

`);

  const [speed, setSpeed] = useState(150);

  const running = useRef(false);
  const [buttonMsg, setButtonMsg] = useState("Start");

  const [frame, setFrame] = useState(0);
  const i = useRef(0);

  const interval = useRef<NodeJS.Timeout>();
  const maxLen = useRef(0);

  // Reference to the button
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // function that runs every frame
  const executeFrame = () => {
    if (i.current >= maxLen.current || running.current === false) {
      // last frame reached
      running.current = false;
      setButtonMsg("Start");

      clearInterval(interval.current!);

      console.log("< loop exit >");
    } else {
      // next frame
      console.log("Frame: ", i.current);

      setFrame(p => p + 1);
      i.current += 1;
    }
  };

  // Code execution setup
  const run = () => {
    if (running.current) {
      return;
    }

    reset();

    try {
      console.log("< timeline eval >");
      if (typeof window !== "undefined") {
        eval(code);
      }
    } catch (err: any) {
      console.error(err);
    }

    maxLen.current = calcLen();
    console.log("set maxLen: ", maxLen.current);

    console.log("< loop entered >");

    setFrame(0);
    i.current = 0;

    running.current = true;

    interval.current = setInterval(executeFrame, speed);
  };

  // Speed change handling
  useEffect(() => {
    if (running.current === false) {
      return;
    }

    console.log("speed: ", speed);

    clearInterval(interval.current);
    interval.current = setInterval(executeFrame, speed);
  }, [speed]);

  // Automatically click the start button 1 second after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (startButtonRef.current && process.env.NODE_ENV !== "production") {
        //startButtonRef.current.click();
      }
    }, 1000);

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex w-screen">
      <div className="flex flex-col mb-2 border-l-2 border-gray-600 w-min">
        <MonacoEditor code={code} setCode={setCode} />
        <button
          ref={startButtonRef}
          className="btn btn-success"
          onClick={() => {
            if (running.current) {
              running.current = false;
              setButtonMsg("Start");
            } else {
              run();
              setButtonMsg("Stop");
            }
          }}
        >
          {buttonMsg}
        </button>
      </div>

      <div className="flex flex-col w-full h-screen">
        <div className="flex items-center justify-center h-screen grow flex-col overflow-hidden">
          <div className="flex gap-10">
            <div className="flex">
              {ids.map((e, key) => {
                if (ids[key].metadata.orientation !== "v") {
                  return null;
                }

                return <e.reactComponent key={key} id={ids[key].id} frame={frame} metadata={ids[key].metadata} />;
              })}
            </div>
            <div className="flex flex-col items-center justify-center gap-10">
              {ids.map((e, key) => {
                if (ids[key].metadata.orientation === "v") {
                  return null;
                }
                // Render the component as JSX with props
                return <e.reactComponent key={key} id={ids[key].id} frame={frame} metadata={ids[key].metadata} />;
              })}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <div className="grow flex justify-center">
            <SpeedModulator speed={speed} setSpeed={setSpeed} />
          </div>
          <progress
            className="progress progress-accent w-40 h-4 m-2 self-end"
            value={buttonMsg === "Stop" ? frame : 0}
            max={maxLen.current}
          ></progress>
        </div>
      </div>
    </div>
  );
}
