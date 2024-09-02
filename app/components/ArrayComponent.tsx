"use client";

import React, { use, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { sync } from "../page";

export var arrayHistory: any[] = [];
export var groupHistory: number[][] = [];
export var indexHistory: number[] = [];

export const useArrayHandler = (root:any) => {
  root.register("Array")

  const group = (data : number[], next = false) => {
    groupHistory.push(data);

    if (next) {
      sync()
    }
  }

  const setIndex =(data : number, next = false) => {
    indexHistory.push(data);

    if (next) {
      sync()
    }
  }

  const setArray = (data : number[], next = false) => {
    arrayHistory.push([...data]);
    
    if (next) {
      sync()
    }
  };

  return [group, setIndex, setArray];
}

export var arrayReset = () => {
  indexHistory = [];
  groupHistory = [];
  arrayHistory = [];
}

const ArrayComponent = React.forwardRef(({ index, data, group }: {  index: number, data:any[], group: number[]}, ref: any) => {
  return (
    <div>
      <div className="flex gap-1">
        {data.map((item, i) => (
          <Box
            key={i}
            data={item}
            active={index === i}
            secoundaryActive={group?.includes(i)}
          />
        ))}
      </div>
    </div>
  );
  }
);

const Box = ({
  data,
  active,
  secoundaryActive,
}: {
  data: any;
  active: boolean;
  secoundaryActive: boolean;
}) => {
  let bgColor = active ? "bg-sky-900" : "bg-stone-900";
  if (secoundaryActive) {
    bgColor = "bg-orange-800";
  }

  return (
    <div
      className={`w-20 h-20 text-3xl flex items-center justify-center border-4 border-gray-950 ${bgColor} text-white`}
    >
      <span>{data ?? ""}</span>
    </div>
  );
};

export default ArrayComponent;
