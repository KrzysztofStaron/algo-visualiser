"use client";

import { ComponentType, destructValue, ids } from "@/app/components/VisualizerApp";

export var stackHistory: any[] = [];

export const createStackHandler = (register: CallableFunction, metadata: any) => {
  const id = register(ComponentType.STACK, metadata);

  stackHistory[id] = [];

  return {
    push: (val: string) => {
      stackHistory[id].push([...(stackHistory[id].at(-1) ?? []), destructValue(val)]);
    },
    shift: () => {
      stackHistory[id].push([...(stackHistory[id].at(-1) ?? [])].shift());
    },
  };
};

export const resetStack = () => {
  stackHistory = [];
};

export const syncStack = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === ComponentType.BASE).map(e => e.id)) {
    while (stackHistory[i].length < maxLen) {
      stackHistory[i].push(stackHistory[i].at(-1)!);
    }
  }
};

const StackComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  return <p>Stack Branch</p>;
};
