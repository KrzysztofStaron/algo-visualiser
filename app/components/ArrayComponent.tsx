"use client";

import React from "react";
import { sync } from "../page";

export var arrayHistory: any[][] = [];
export var groupHistory: number[][][] = [];
export var indexHistory: number[][] = [];

export const createArrayHandler = (root:any) => {
  const id = root.register("Array");

  arrayHistory[id] = [];
  groupHistory[id] = [];
  indexHistory[id] = [];

  console.log("Array created", id);

  const group = (data : number[], synhronize = true) => {
    groupHistory[id].push([...data]);

    if (synhronize) {
      sync(id)
    }
  }

  const setIndex = (data : number, synhronize = true) => {
    indexHistory[id].push(data);
  
    if (synhronize) {
      sync(id)
    }
  }

  const setArr = (data : number[], synhronize = true) => {
    arrayHistory[id].push([...data]);
      
    if (synhronize) {
      sync(id)
    }
  }

  return {
    group: (data : number[], synhronize = true) => {
      group(data, synhronize);
    },
  
    setIndex: (data : number, synhronize = true) => {
      setIndex(data, synhronize);
    },

    setArr: (data : number[], synhronize = true) => {
      setArr(data, synhronize)
    },

    frame: (data : { index? : number, group?: number[], content?: any[]}) => {
      if (data["index"] != undefined) {
        setIndex(data["index"], false)
      }
      if (data["content"] != undefined) {
        setArr(data["content"], false)
      }
      if (data["group"] != undefined) {
        group(data["group"], false)
      }

      sync(id);
    }
  }

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
        {(data ?? []).map((item, i) => (
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
