"use client";

import React from "react";
import { destructValue, sync } from "../page";

export var matrixHistory : any[][][][] = [];
export var matrixColorHistory : any[][] = [];


// set
// setColors({0: red, 1:green})
// frame

export const createMatrixHandler = (root:any, metadata:any) => {
  const id = root.register("Matrix", metadata);

  matrixHistory[id] = [];

  console.log("Matrix Created: ", id)


  return {
    set: (data : any, synhronize = true) => {
      matrixHistory[id].push(destructValue(data));
  
      if (synhronize) {
        sync(id)
      }
    }
  }

}

export var resetMatrix = () => {
  matrixHistory = [];
}

const MatrixComponent = ({content, metadata} : {content: any[][], metadata: any}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {content.map((row, rowIndex) => (
        <div key={rowIndex} className="grid">
          {row.map((data, colIndex) => (
            <Box
              key={colIndex}
              data={data}
              active={false}
              secoundaryActive={false}
              animate={false}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

const Box = ({
  data,
  active,
  secoundaryActive,
  animate
}: {
  data: any;
  active: boolean;
  secoundaryActive: boolean;
  animate: boolean;
}) => {
  let bgColor = active ? "bg-sky-900" : "bg-stone-900";
  if (secoundaryActive) {
    bgColor = "bg-orange-800";
  }

  return (
    <div
      className={`w-20 h-20 text-3xl flex items-center justify-center border-4 border-gray-950 ${bgColor} text-white ${animate ? "transition-all duration-100 ease" : ""}`}
    >
      <span>{data ?? ""}</span>
    </div>
  );
};

export default MatrixComponent;
