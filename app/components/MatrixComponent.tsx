"use client";

import React from "react";
import { destructValue, ids, sync } from "../page";

export var matrixHistory: any[][][][] = [];
export var matrixColorHistory: MatrixColor[][] = [];

export type MatrixColor = { [key: string]: string };

/* Example data
const exampleColors: MatrixColor = {
  0: "red",
  1: "green",
  2: "blue",
};*/

// set
// setColors({0: red, 1:green})
// frame

export const matrixSync = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === "Matrix").map(e => e.id)) {
    while (matrixHistory[i].length < maxLen) {
      matrixHistory[i].push(matrixHistory[i].at(-1)!);
    }

    while (matrixColorHistory[i].length < maxLen) {
      matrixColorHistory[i].push(matrixColorHistory[i].at(-1) || {});
    }
  }
};

export const createMatrixHandler = (root: any, metadata: any) => {
  const id = root.register("Matrix", metadata);

  matrixHistory[id] = [];
  matrixColorHistory[id] = [];

  console.log("Matrix Created: ", id);

  return {
    content: (data: any, synhronize = true) => {
      matrixHistory[id].push(destructValue(data));

      if (synhronize) {
        sync();
      }
    },
    colors: (data: MatrixColor, synhronize = true) => {
      matrixColorHistory[id].push({ ...data });

      if (synhronize) {
        sync();
      }
    },
  };
};

export const resetMatrix = () => {
  matrixHistory = [];
  matrixColorHistory = [];
};

const MatrixComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  const content = matrixHistory[id][Math.min(frame, matrixHistory[id].length - 1)] ?? [];
  const rotatedContent = (content[0] ?? []).map((_, colIndex) => content.map(row => row[colIndex]));

  const colors = matrixColorHistory[id][Math.min(frame, matrixColorHistory[id].length - 1)] ?? {};

  return (
    <div className="flex gap-1">
      {rotatedContent.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col gap-1">
          {row.map((data, colIndex) => (
            <Box
              key={colIndex}
              data={data}
              color={colors[data] ?? ""}
              active={false}
              secoundaryActive={false}
              animate={false}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Box = ({
  data,
  active,
  secoundaryActive,
  animate,
  color,
}: {
  data: any;
  active: boolean;
  secoundaryActive: boolean;
  animate: boolean;
  color: string;
}) => {
  let bgColor = active ? "bg-sky-900" : "bg-stone-900";
  if (secoundaryActive) {
    bgColor = "bg-orange-800";
  }

  return (
    <div
      style={{ backgroundColor: color }}
      className={`w-20 h-20 text-3xl flex items-center justify-center border-4 border-gray-950 ${bgColor} text-white ${
        animate ? "transition-all duration-100 ease" : ""
      }`}
    >
      <span>{data ?? ""}</span>
    </div>
  );
};

export default MatrixComponent;
