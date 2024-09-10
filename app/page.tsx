"use client";

import { useEffect, useRef, useState } from "react";
import ArrayComponent, {
  arrayHistory,
  arrayReset,
  indexHistory,
  groupHistory,
  createArrayHandler,
  arraySync,
} from "./components/ArrayComponent";
import LabelComponent, { createLabelHandler, labelHistory, labelSync, resetLabel } from "./components/LabelComponent";
import Timeline from "./components/Timeline";
import MatrixComponent, {
  createMatrixHandler,
  matrixColorHistory,
  matrixGroupHistory,
  matrixHistory,
  matrixSync,
  resetMatrix,
} from "./components/MatrixComponent";
import { PrismCodeEditor } from "./components/PrismCodeEditor";

export var ids: { type: ComponentType; id: number; metadata: any }[] = [];

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

  console.log("Max Len: ", max);

  return max;
};

const reset = () => {
  ids = [];

  arrayReset();
  resetLabel();
  resetMatrix();
};

export const sync = () => {
  console.log("sync()");

  const maxLen = calcLen();

  arraySync(maxLen);
  labelSync(maxLen);
  matrixSync(maxLen);
};

export default function Home() {
  const [code, setCode] = useState("");

  const initCode = useRef(`
const matrix = createMatrix();

matrix.content([[0, 1, 1], [1, 1, 0], [0, 0, 1]])
matrix.colors({0: "green"})
matrix.replace([0,0], 5)
matrix.group([[0, 1]])
matrix.replace([0,0], 6)
matrix.replace([0,0], 7)
    `);

  const [speed, setSpeed] = useState(300);

  const running = useRef(false);

  const [buttonMsg, setButtonMsg] = useState("Start");

  const root = useRef({
    register(component: ComponentType, metadata?: any) {
      const id = ids.filter(e => e.type === component).length;
      console.log({ component: component, index: ids.length, id: id });

      ids.push({ type: component, id: id, metadata: metadata ?? {} });
      return id;
    },
  });

  const [frame, setFrame] = useState(0);
  const i = useRef(0);

  const interval = useRef<NodeJS.Timeout>();

  const createArray = (metadata?: any) => {
    return createArrayHandler(root.current, metadata ?? "");
  };

  const createLabel = (metadata: any) => {
    return createLabelHandler(root.current, metadata ?? "");
  };

  const createMatrix = (metadata: any) => {
    return createMatrixHandler(root.current, metadata ?? "");
  };

  const currentFrame = (len: number) => {
    return Math.min(frame, len);
  };

  const executeFrame = () => {
    if (i.current >= calcLen() || running.current === false) {
      console.log("Loop exited");
      running.current = false;
      setButtonMsg("Start");
      clearInterval(interval.current!);

      return;
    }

    console.log("Frame: ", i.current);

    setFrame(p => p + 1);
    i.current += 1;
  };

  const run = () => {
    if (running.current) {
      return;
    }

    reset();

    try {
      eval(code);
    } catch (err: any) {
      console.error(err);
    }

    console.log("Loop entered: ");

    setFrame(0);
    i.current = 0;

    running.current = true;

    interval.current = setInterval(executeFrame, speed);
  };

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
      <div className="flex flex-col" style={{ width: "50rem" }}>
        <PrismCodeEditor setCode={setCode} />
        {/*<CodeEditor
          value={code}
          language="js"
          placeholder="let arr = [1, 2, 3, 4, 5];"
          onChange={evn => setCode(evn.target.value)}
          className="h-full font-bold overflow-scroll"
          padding={15}
          style={{
            backgroundColor: "rgb(3 7 18)",
            fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            width: "50rem",
          }}
        />*/}
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
        <div className="flex items-center justify-center h-screen grow flex-col">
          <div className="flex gap-10">
            <div>
              {ids.map((e, key) => {
                if (ids[key].metadata.orientation !== "v") {
                  return null;
                }

                if (e.type === ComponentType.ARRAY) {
                  return <ArrayComponent key={key} id={e.id} frame={frame} metadata={ids[key].metadata} />;
                } else {
                  return null;
                }
              })}
            </div>
            <div className="flex flex-col items-center justify-center gap-10">
              {ids.map((e, key) => {
                if (ids[key].metadata.orientation === "v") {
                  return null;
                }

                if (e.type === ComponentType.ARRAY) {
                  return (
                    <ArrayComponent key={key} id={e.id} frame={frame} metadata={ids[key].metadata}></ArrayComponent>
                  );
                } else if (e.type === ComponentType.LABEL) {
                  return <LabelComponent key={key} id={e.id} frame={frame} metadata={ids[key].metadata} />;
                } else if (e.type === ComponentType.MATRIX) {
                  return <MatrixComponent key={key} id={e.id} frame={frame} metadata={ids[key].metadata} />;
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </div>
        <label>
          <input
            type="range"
            min={50}
            max={400}
            value={speed}
            onChange={e => setSpeed(parseInt(e.target.value))}
            step={50}
          />
          <span className="px-2">{speed}</span>
        </label>
        <Timeline />
      </div>
    </div>
  );
}
