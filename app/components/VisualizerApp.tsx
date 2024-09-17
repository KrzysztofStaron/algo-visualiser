"use client";

import { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  arrayHistory,
  arrayReset,
  indexHistory,
  groupHistory,
  createArrayHandler,
  arraySync,
} from "./visualizers/array/ArrayComponent";
import { createLabelHandler, labelHistory, labelSync, resetLabel } from "./visualizers/label/LabelComponent";
import {
  createMatrixHandler,
  matrixColorHistory,
  matrixGroupHistory,
  matrixHistory,
  matrixSync,
  resetMatrix,
} from "./visualizers/matrix/MatrixComponent";
const MonacoEditor = dynamic(() => import("./MonacoEditor"), { ssr: false });
import SpeedModulator from "./SpeedModulator";
import dynamic from "next/dynamic";
import { createStackHandler, resetStack, stackHistory, syncStack } from "./visualizers/stack/StackComponent";

type ComponentData = { type: ComponentType; id: number; metadata: any; reactComponent: FunctionComponent<any> };

export var ids: ComponentData[] = [];

export const destructValue = (lambda: any) => {
  if (typeof lambda === "function") {
    return lambda();
  }

  return lambda;
};

export enum ComponentType {
  BASE,
  ARRAY = "Array",
  LABEL = "Label",
  MATRIX = "Matrix",
  STACK = "Stack",
}

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

  return max;
};

const reset = () => {
  ids = [];

  arrayReset();
  resetLabel();
  resetMatrix();
  resetStack();
};

export const sync = () => {
  const maxLen = calcLen();
  console.log(`sync(), maxLen: ${maxLen}`);

  arraySync(maxLen);
  labelSync(maxLen);
  matrixSync(maxLen);
  syncStack(maxLen);
};

const register = (component: ComponentType, reactComponent: FunctionComponent<any>, metadata?: any) => {
  const id = ids.filter(e => e.type === component).length;
  console.log({ component: component, index: ids.length, id: id, reactComponent: reactComponent });

  ids.push({ type: component, id: id, metadata: metadata ?? {}, reactComponent: reactComponent });
  return id;
};

export default function VisualizerApp() {
  const [code, setCode] = useState(`const matrix = createMatrix()

matrix.colors({ 0: "bg-red-400", 1: "green", 2: "#ff00ff" })
matrix.content([[0, 1, 2]])
`);

  const [speed, setSpeed] = useState(150);

  const running = useRef(false);

  const [buttonMsg, setButtonMsg] = useState("Start");

  const [frame, setFrame] = useState(0);
  const i = useRef(0);

  const interval = useRef<NodeJS.Timeout>();
  const maxLen = useRef(0);

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

  return (
    <div className="h-screen flex w-screen">
      <div className="flex flex-col mb-2 border-l-2 border-gray-600 w-min">
        <MonacoEditor code={code} setCode={setCode} />
        <button
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
