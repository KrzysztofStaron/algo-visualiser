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
import CodeEditor from "@uiw/react-textarea-code-editor";
import LabelComponent, { createLabelHandler, labelHistory, labelSync, resetLabel } from "./components/LabelComponent";
import Timeline from "./components/Timeline";
import MatrixComponent, {
  createMatrixHandler,
  matrixColorHistory,
  matrixHistory,
  matrixSync,
  resetMatrix,
} from "./components/MatrixComponent";

export var ids: { type: string; id: number; metadata: any }[] = [];

export const destructValue = (lambda: any) => {
  if (typeof lambda === "function") {
    return lambda();
  }

  return lambda;
};

const calcLen = () => {
  let max = 0;

  for (let i of ids.filter(e => e.type === "Array").map(e => e.id)) {
    max = Math.max(max, arrayHistory[i].length, groupHistory[i].length, indexHistory[i].length);
  }

  for (let i of ids.filter(e => e.type === "Label").map(e => e.id)) {
    max = Math.max(max, labelHistory[i].length);
  }

  for (let id of ids.filter(e => e.type === "Matrix").map(e => e.id)) {
    max = Math.max(max, matrixHistory[id].length ?? 0, matrixColorHistory[id].length ?? 0);
  }

  console.log("Max Len: ", max);

  return max;
};

const reset = () => {
  arrayReset();
  resetLabel();
  resetMatrix();
};

export const sync = () => {
  const maxLen = calcLen();

  arraySync(maxLen);

  labelSync(maxLen);

  matrixSync(maxLen);
};

export default function Home() {
  const [code, setCode] = useState(`
const matrix = createMatrix();

matrix.content([[0, 1, 1], [1, 1, 0], [0, 0, 1]])
matrix.colors({0: "green"})
    `);
  const [speed, setSpeed] = useState(300);

  const running = useRef(false);

  const root = useRef({
    register(component: string, metadata?: any) {
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
    console.log("Frame: ", i.current);

    setFrame(p => p + 1);
    i.current += 1;

    if (i.current >= calcLen()) {
      console.log("Loop exited");
      running.current = false;
      clearInterval(interval.current!);
    }
  };

  const run = () => {
    if (running.current) {
      return;
    }
    ids = [];

    reset();

    try {
      eval(code);
    } catch (err: any) {
      console.error(err);
    }

    console.log("Loop entered: ");

    setFrame(0);
    i.current = 0;

    console.log("his: ", matrixColorHistory);
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
        <CodeEditor
          value={code}
          language="js"
          placeholder="let arr = [1, 2, 3, 4, 5];"
          onChange={evn => setCode(evn.target.value)}
          className="h-full font-bold"
          padding={15}
          style={{
            backgroundColor: "rgb(3 7 18)",
            fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            width: "50rem",
          }}
        />
        <button
          className="btn btn-success"
          onClick={() => {
            run();
          }}
        >
          {" "}
          Run
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

                if (e.type === "Array") {
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

                if (e.type === "Array") {
                  return (
                    <ArrayComponent key={key} id={e.id} frame={frame} metadata={ids[key].metadata}></ArrayComponent>
                  );
                } else if (e.type === "Label") {
                  return <LabelComponent key={key} id={e.id} frame={frame} metadata={ids[key].metadata} />;
                } else if (e.type === "Matrix") {
                  return <MatrixComponent key={key} id={e.id} frame={frame} metadata={ids[key].metadata} />;
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </div>
        <label>
          <input type="range" min={1} max={400} value={speed} onChange={e => setSpeed(parseInt(e.target.value))} />
          <span className="px-2">{speed}</span>
        </label>
        <Timeline />
      </div>
    </div>
  );
}
