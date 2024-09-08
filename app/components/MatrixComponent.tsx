"use client";

import React from "react";
import { ComponentType, destructValue, ids, sync } from "../page";

export var matrixHistory: Array<Array<string[][]>> = [];
export var matrixColorHistory: Array<Array<MatrixColor>> = [];
export var matrixGroupHistory: Array<Array<position[]>>;

type position = [number, number];
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
  for (let i of ids.filter(e => e.type === ComponentType.MATRIX).map(e => e.id)) {
    while (matrixHistory[i].length < maxLen) {
      matrixHistory[i].push(matrixHistory[i].at(-1) || []);
    }

    while (matrixColorHistory[i].length < maxLen) {
      matrixColorHistory[i].push(matrixColorHistory[i].at(-1) || {});
    }

    while (matrixGroupHistory[i].length < maxLen) {
      matrixGroupHistory[i].push(matrixGroupHistory[i].at(-1) || []);
    }
  }
};

export const createMatrixHandler = (root: any, metadata: any) => {
  const id = root.register(ComponentType.MATRIX, metadata);

  matrixHistory[id] = [];
  matrixColorHistory[id] = [];
  matrixGroupHistory[id] = [];

  const setContent = (data: any, synhronize: boolean) => {
    matrixHistory[id].push(destructValue(data));

    if (synhronize) {
      sync();
    }
  };

  const setColors = (data: MatrixColor, synhronize: boolean) => {
    matrixColorHistory[id].push({ ...data });

    if (synhronize) {
      sync();
    }
  };

  const setGroup = (data: position[], synhronize: boolean) => {
    matrixGroupHistory[id].push([...destructValue(data)]);

    if (synhronize) {
      sync();
    }
  };

  return {
    replace: (position: position, value: string, synhronize = true) => {
      let last: any[][] = matrixHistory[id].at(-1)!.map(e => [...e]);
      last[position[0]][position[1]] = value;
      setContent(last, synhronize);
    },
    content: (data: string[][], synhronize = true) => {
      setContent(data, synhronize);
    },
    colors: (data: MatrixColor, synhronize = true) => {
      setColors(data, synhronize);
    },
    group: (data: Array<[number, number]>, synhronize = true) => {
      setGroup(data, synhronize);
    },
    frame: (data: { content?: any[][]; colors?: MatrixColor; group?: position[] }, synhronize = true) => {
      if (data["content"] != undefined) {
        setContent(data["content"], false);
      }

      if (data["colors"] != undefined) {
        setColors(data["colors"], false);
      }

      if (data["group"] != undefined) {
        setGroup(data["group"], false);
      }

      if (synhronize) {
        sync();
      }
    },
  };
};

export const resetMatrix = () => {
  matrixHistory = [];
  matrixColorHistory = [];
  matrixGroupHistory = [];
};

const MatrixComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  const content = matrixHistory[id][Math.min(frame, matrixHistory[id].length - 1)] ?? [];
  const rotatedContent = (content[0] ?? []).map((_, colIndex) => content.map(row => row[colIndex]));
  const group = matrixGroupHistory[id][Math.min(frame, matrixGroupHistory[id].length - 1)] ?? [];

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
              secoundaryActive={group.filter(e => e[0] === rowIndex && e[1] === colIndex).length > 0}
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
