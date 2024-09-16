import React from "react";
import { ComponentType, destructValue, ids, sync } from "@/app/page";

export var arrayHistory: Array<Array<string[]>> = [];
export var groupHistory: Array<Array<number[]>> = [];
export var indexHistory: Array<Array<number>> = [];

export const arraySync = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === ComponentType.ARRAY).map(e => e.id)) {
    while (arrayHistory[i].length < maxLen) {
      arrayHistory[i].push(arrayHistory[i].at(-1)!);
    }

    while (groupHistory[i].length < maxLen) {
      groupHistory[i].push(groupHistory[i].at(-1)!);
    }

    while (indexHistory[i].length < maxLen) {
      indexHistory[i].push(indexHistory[i].at(-1)!);
    }
  }
};

export const createArrayHandler = (register: CallableFunction, metadata: any) => {
  const id = register(ComponentType.ARRAY, metadata);

  arrayHistory[id] = [];
  groupHistory[id] = [];
  indexHistory[id] = [];

  const group = (data: number[], synhronize = true) => {
    groupHistory[id].push([...destructValue(data)]);

    if (synhronize) {
      sync();
    }
  };

  const setIndex = (data: number, synhronize = true) => {
    indexHistory[id].push(destructValue(data));

    if (synhronize) {
      sync();
    }
  };

  const setArr = (data: string[], synhronize = true) => {
    arrayHistory[id].push([...destructValue(data)]);

    if (synhronize) {
      sync();
    }
  };

  return {
    group: (data: number[], synhronize = true) => {
      group(data, synhronize);
    },

    setIndex: (data: number, synhronize = true) => {
      setIndex(data, synhronize);
    },

    setArr: (data: string[], synhronize = true) => {
      setArr(data, synhronize);
    },

    frame: (data: { index?: number; group?: number[]; content?: any[] }, synhronize = true) => {
      if (data["index"] != undefined) {
        setIndex(data["index"], false);
      }
      if (data["content"] != undefined) {
        setArr(data["content"], false);
      }
      if (data["group"] != undefined) {
        group(data["group"], false);
      }
      if (synhronize) {
        sync();
      }
    },
  };
};

export const arrayReset = () => {
  indexHistory = [];
  groupHistory = [];
  arrayHistory = [];
};

const ArrayComponent = React.forwardRef(
  ({ frame, id, metadata }: { frame: number; id: number; metadata: any }, ref: any) => {
    const flexType = (metadata.orientation ?? "") !== "v" ? "" : "flex-col";

    const data = arrayHistory[id][Math.min(frame, arrayHistory[id].length - 1)];
    const index = indexHistory[id][Math.min(frame, indexHistory[id].length - 1)];
    const group = groupHistory[id][Math.min(frame, groupHistory[id].length - 1)];

    return (
      <div>
        <div className={`flex gap-1 ${flexType}`}>
          {(data ?? []).map((item: any, i: number) => (
            <Box
              key={i}
              data={item}
              active={index === i}
              secoundaryActive={group?.includes(i)}
              animate={metadata.anim ?? true}
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
  animate,
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
      className={`w-20 h-20 text-3xl flex items-center justify-center border-4 border-gray-950 ${bgColor} text-white ${
        animate ? "transition-all duration-100 ease" : ""
      }`}
    >
      <span>{data ?? ""}</span>
    </div>
  );
};

export default ArrayComponent;
