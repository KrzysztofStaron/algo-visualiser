"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import ArrayComponent, { arrayHistory, arrayReset, indexHistory, groupHistory, useArrayHandler } from "./components/ArrayComponent";
import CodeEditor from '@uiw/react-textarea-code-editor';

type state = {
  get: any;
  set: CallableFunction;
};

export const sync = () => {
  const maxLen = Math.max(arrayHistory.length, groupHistory.length, indexHistory.length);

  while (arrayHistory.length < maxLen) {
    arrayHistory.push(arrayHistory.at(-1)!)
  }

  while (groupHistory.length < maxLen) {
    groupHistory.push(groupHistory.at(-1)!)
  }

  while (indexHistory.length < maxLen) {
    indexHistory.push(indexHistory.at(-1)!)
  }
}

export default function Home() {
  const [code, setCode] = useState(`
const [group, setIndex, setArray] = useArray();

setIndex(0)
setArray([1,0,0])

setIndex(1)
setArray([0,2,0])

setIndex(2)
setArray([0,0,3])

group([0,1,2])
setIndex(4)
setArray([0,0,0])
    `
  );
  const [speed, setSpeed] = useState(300);
  const [ids, setIds] = useState<string[]>([])

  const [index, setIndex] = useState(0);
  const [group, setGroup] = useState<number[]>([]);
  const [arr, setArr] = useState<any[]>([]);

  const root = useRef({
    register(component : string) {
      console.log("Regustered: ", component)
      setIds(prev => [...prev, component])
      return ids.length+1;
    }
  })

  const useArray = () => {
    return useArrayHandler(root.current)
  }

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
            setIds([]);

            arrayReset()

            eval(code);

            i.current = 0;
            console.log("his: ", arrayHistory);
            const interval = setInterval(() => {
              console.log("interval");
              setIndex(indexHistory[i.current]);
              setGroup(groupHistory[i.current]);
              setArr(arrayHistory[i.current]);

              i.current++;
              if (i.current >= indexHistory.length) {
                console.log("clear");
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

      <div className="flex items-center justify-center h-screen grow">
        {ids.map((e, i) => {
          if (e === "Array") {
            return <ArrayComponent key={i} index={index} group={group} data={arr}></ArrayComponent>
          } else {
            return null
          }
        })}
      </div>
    </div>
  );
}
