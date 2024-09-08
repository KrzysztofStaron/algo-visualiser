"use client";

import { useEffect, useRef, useState } from "react";
import ArrayComponent, { arrayHistory, arrayReset, indexHistory, groupHistory, createArrayHandler, arraySync } from "./components/ArrayComponent";
import CodeEditor from '@uiw/react-textarea-code-editor';
import LabelComponent, { createLabelHandler, labelHistory, labelSync, resetLabel } from "./components/LabelComponent";
import Timeline from "./components/Timeline";
import MatrixComponent, { createMatrixHandler, matrixColorHistory, matrixHistory, matrixSync, resetMatrix } from "./components/MatrixComponent";

export var ids : {type: string, id: number, metadata: any}[] = [];

export const destructValue = (lambda : any) => {
  if (typeof lambda === "function") {
    return lambda()
  } 

  return lambda;
}

const calcLen = () => {
  let max = 0;

  for (let i of ids.filter(e => e.type === "Array").map(e => e.id)) {
    max = Math.max(max, arrayHistory[i].length, groupHistory[i].length, indexHistory[i].length)
  }

  for (let i of ids.filter(e => e.type === "Label").map(e => e.id)) {
    max = Math.max(max, labelHistory[i].length)
  }

  for (let i of ids.filter(e => e.type === "Matrix").map(e => e.id)) {
    max = Math.max(max, matrixHistory[i].length, matrixColorHistory[i].length)
  }

  console.log("Max: " , max)

  return max;
}

const reset = () => {
  arrayReset();
  resetLabel();
  resetMatrix();
}

export const sync = (id : number) => {
  const maxLen = calcLen()

  console.log("sync", maxLen)

  arraySync(maxLen);

  labelSync(maxLen);

  matrixSync(maxLen);

  console.log(matrixColorHistory);
}

export default function Home() {
  const [code, setCode] = useState(`
const matrix = createMatrix();

matrix.set([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    `
  );
  const [speed, setSpeed] = useState(300);

  const running = useRef(false);

  const root = useRef({
    register(component : string, metadata? : any) {
      const ret = ids.length;
      console.log("register", ret);

      const id = ids.filter(e => e.type === component).length;
      console.log(component, ": ", id);

      ids.push({type: component, id: id, metadata: metadata ?? {}});
      return id;
    }
  });

  const [frame, setFrame] = useState(0);
  const i = useRef(0);

  const interval = useRef<NodeJS.Timeout>();

  const createArray = (metadata? : any) => {
    return createArrayHandler(root.current, metadata ?? "")
  }

  const createLabel = (metadata : any) => {
    return createLabelHandler(root.current, metadata ?? "")
  }

  const createMatrix = (metadata : any) => {
    return createMatrixHandler(root.current, metadata ?? "")
  }

  const currentFrame = (len : number) => {
    return Math.min(frame, len)
  }

  const executeFrame = () => {
    console.log("interval");

    setFrame(p => p + 1);
    i.current += 1;

    const frames = calcLen();
    console.log("frames: ", frames);

    if (i.current >= frames) {
      console.log("clear");
      running.current = false;
      clearInterval(interval.current!);
    }
  }

  const run = () => {
    if (running.current) { 
      return;
    }
    ids = [];

    reset()

    try {
      eval(code);
    } catch (err : any) {
      console.error(err);
    }


    setFrame(0);
    i.current = 0;

    console.log("his: ", arrayHistory);
    running.current = true;

    interval.current = setInterval(executeFrame, speed);
  }

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
      <div className="flex flex-col" style={{width: "50rem"}}>
          <CodeEditor
            value={code}
            language="js"
            placeholder="let arr = [1, 2, 3, 4, 5];"
            onChange={(evn) => setCode(evn.target.value)}
            className="h-full font-bold"
            padding={15}
            style={{
              backgroundColor: "rgb(3 7 18)",
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
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
                    return null
                  }

                  if (e.type === "Array") {
                    return <ArrayComponent key={key} index={indexHistory[e.id][currentFrame(indexHistory[e.id].length - 1)]} group={groupHistory[e.id][Math.min(frame, groupHistory[e.id].length - 1)]} data={arrayHistory[e.id][Math.min(frame, arrayHistory[e.id].length - 1)]} metadata={ids[key].metadata}></ArrayComponent>
                  } else {
                    return null
                  }
                })}
            </div>
            <div className="flex flex-col items-center justify-center gap-10">
              {ids.map((e, key) => {
                if (ids[key].metadata.orientation === "v") {
                  return null
                }

                if (e.type === "Array") {
                  return <ArrayComponent key={key} index={indexHistory[e.id][currentFrame(indexHistory[e.id].length - 1)]} group={groupHistory[e.id][Math.min(frame, groupHistory[e.id].length - 1)]} data={arrayHistory[e.id][Math.min(frame, arrayHistory[e.id].length - 1)]} metadata={ids[key].metadata}></ArrayComponent>
                } else if (e.type === "Label") {
                  return <LabelComponent key={key} content={labelHistory[e.id][currentFrame(labelHistory[e.id].length - 1)]} metadata={ids[key].metadata}/>
                } else if (e.type === "Matrix") {
                  return <MatrixComponent key={key} content={matrixHistory[e.id][currentFrame(matrixHistory[e.id].length - 1)]} metadata={ids[key].metadata} colors={matrixColorHistory[e.id][currentFrame(matrixColorHistory[e.id].length - 1)]}/>
                } else {
                  return null
                }
              })}
            </div>
          </div>
        </div>
        <label>
          <input
            type="range"
            min={1}
            max={400}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
          />
          <span className="px-2">{speed}</span>
        </label>
        <Timeline />
      </div>

    </div>
  );
}
