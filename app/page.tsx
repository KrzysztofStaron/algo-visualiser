"use client";

import { useEffect, useRef, useState } from "react";
import ArrayComponent, { arrayHistory, arrayReset, indexHistory, groupHistory, createArrayHandler } from "./components/ArrayComponent";
import CodeEditor from '@uiw/react-textarea-code-editor';
import LabelComponent, { createLabelHandler, labelHistory, resetLabel } from "./components/LabelComponent";

export var ids : {type: string, id: number, metadata: any}[] = []

// TODO: fix
const calcLen = () => {
  let max = 0;

  for (let i of ids.filter(e => e.type === "Array").map(e => e.id)) {
    max = Math.max(max, arrayHistory[i].length, groupHistory[i].length, indexHistory[i].length)
  }

  for (let i of ids.filter(e => e.type === "Label").map(e => e.id)) {
    max = Math.max(max, labelHistory[i].length)
  }

  console.log("Max: " , max)

  return max;
}
const reset = () => {
  arrayReset();
  resetLabel();
}

export const sync = (id : number) => {
  const maxLen = calcLen()

  console.log("sync", maxLen)

  for (let i of ids.filter(e => e.type === "Array").map(e => e.id)) {
    while (arrayHistory[i].length < maxLen) {
      arrayHistory[i].push(arrayHistory[i].at(-1)!)
    }
  
    while (groupHistory[i].length < maxLen) {
      groupHistory[i].push(groupHistory[i].at(-1)!)
    }
  
    while (indexHistory[i].length < maxLen) {
      indexHistory[i].push(indexHistory[i].at(-1)!)
    }
  }

  for (let i of ids.filter(e => e.type === "Label").map(e => e.id)) {
    while (labelHistory[i].length < maxLen) {
      labelHistory[i].push(labelHistory[i].at(-1)!)
    }
  }
}

export default function Home() {
  const [code, setCode] = useState(`
    const left = createArray({orientation: "v", anim: false});
    const top = createArray();
    const text = createLabel();
    
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    text.set(arr.length-1, false)
    
    left.frame({
      content: arr, 
      index: 10,
    }, false);
    
    top.frame({
      content: arr,
      group: arr
    });
    
    while (arr.length != 1) {
      let r = arr.pop();
      top.group(arr, false);
      text.set(r, false)
      left.frame({
        content: arr,
        index: arr.length-1,
      });
    }
    
    while (arr.length != 11) {
      text.set(arr.length, false)
      arr.push(arr.length);
      top.group(arr, false);
      left.frame({
        content: arr,
        index: arr.length-1,
      });
    }
    
    top.group(arr);
    
    `
  );
  const [speed, setSpeed] = useState(300);

  const running = useRef(false);

  // Maybe use Reference
  const root = useRef({
    register(component : string, metadata? : any) {
      const ret = ids.length;
      console.log("register", ret);

      const id = ids.filter(e => e.type === component).length;
      console.log(component, ": ", id);

      ids.push({type: component, id: id, metadata: metadata ?? {}});
      return id;
    }
  })

  const createArray = (metadata? : any) => {
    return createArrayHandler(root.current, metadata ?? "")
  }

  const createLabel = (metadata : any) => {
    return createLabelHandler(root.current, metadata ?? "")
  }

  const currentFrame = (len : number) => {
    return Math.min(frame, len)
  }

  const [frame, setFrame] = useState(0);
  const i = useRef(0);

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

            const frames = calcLen();
            console.log("frames: ", frames);

            const interval = setInterval(() => {
              console.log("interval");

              setFrame(p => p + 1);
              i.current += 1;

              if (i.current >= frames) {
                console.log("clear");
                running.current = false;
                clearInterval(interval);
              }
            }, speed);
          }}
        >
          {" "}
          Run
        </button>
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
        />
      </div>

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
              } else {
                return null
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
