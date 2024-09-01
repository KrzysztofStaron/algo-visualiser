"use client";

import { use, useEffect, useRef, useState } from "react";
import ArrayComponent from "./components/ArrayComponent";

type state = {
  get: any;
  set: CallableFunction;
};

export default function Home() {
  const visoRef = useRef<any>();
  const [code, setCode] = useState("");

  return (
    <div className="h-screen flex w-screen">
      <div className="flex flex-col grow">
        <textarea
          value={code}
          className="grow w-full"
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
        <button
          className="btn btn-warning"
          onClick={() => {
            visoRef.current?.exec(code);
          }}
        >
          Go
        </button>
      </div>
      <div className="flex items-center justify-center h-screen grow">
        <ArrayComponent
          data={[1, 2, 0, 0, 0, 0, 0, 0, 0, 0]}
          start={1}
          ref={visoRef}
        ></ArrayComponent>
      </div>
    </div>
  );
}
