"use client";

import { useEffect, useRef, useState } from "react";
import ArrayComponent, { arrayHistory, arrayReset, indexHistory, groupHistory, createArrayHandler } from "./components/ArrayComponent";
import CodeEditor from '@uiw/react-textarea-code-editor';


var ids : string[] = []
type state = {
  get: any;
  set: CallableFunction;
};

export const sync = (id : number) => {
  const maxLen = Math.max(arrayHistory.length, groupHistory.length, indexHistory.length);

  while (arrayHistory.length < maxLen) {
    arrayHistory[id].push(arrayHistory[id].at(-1)!)
  }

  while (groupHistory.length < maxLen) {
    groupHistory[id].push(groupHistory[id].at(-1)!)
  }

  while (indexHistory.length < maxLen) {
    indexHistory[id].push(indexHistory[id].at(-1)!)
  }
}

export default function Home() {
  const [code, setCode] = useState(`
const arr = createArray();

arr.frame({
  index: 4,
  content: [1, 2, 3, 4, 5],
});

arr.group([4]);

arr.frame({
  index: 3,
  content: [1, 2, 3, 4],
});

arr.group([3]);

arr.frame({
  index: 2,
  content: [1, 2, 3],
});

arr.group([2]);

  arr.frame({
  index: 1,
  content: [1, 2],
});

arr.group([1]);

arr.frame({
  index: 0,
  content: [1],
});

arr.group([0]);
arr.setArr([])
    `
  );
  const [speed, setSpeed] = useState(300);

  const running = useRef(false);

  // Maybe use Reference, ids was prev state, try things, bec it doesn't synchronise well
  const root = useRef({
    register(component : string) {
      const ret = ids.length;
      console.log("register", ret);
      ids.push(component);
      return ret;
    }
  })

  const createArray = () => {
    return createArrayHandler(root.current)
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

            arrayReset()

            try {
              eval(code);
            } catch (err : any) {
              console.error(err);
            }


            setFrame(0);
            i.current = 0;

            console.log("his: ", arrayHistory);
            running.current = true;

            const frames = Math.max(...arrayHistory.map(e => e.length));

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
        {ids.map((e, id) => {
          if (e === "Array") {
            return <ArrayComponent key={id} index={indexHistory[id][frame]} group={groupHistory[id][frame]} data={arrayHistory[id][frame]}></ArrayComponent>
          } else {
            return null
          }
        })}
      </div>
    </div>
  );
}
