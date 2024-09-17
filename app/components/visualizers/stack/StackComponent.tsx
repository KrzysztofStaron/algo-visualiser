"use client";

import { ComponentType, destructValue, ids } from "@/app/components/VisualizerApp";

export var stackHistory: Array<Array<(number | string)[]>> = [];

export const createStackHandler = (register: CallableFunction, metadata: any) => {
  const id = register(ComponentType.STACK, StackComponent, metadata);

  stackHistory[id] = [];

  return {
    push: (val: string) => {
      stackHistory[id].push([...(stackHistory[id].at(-1) ?? []), destructValue(val)]);
    },
    pop: () => {
      // Changed to pop for typical stack behavior
      const currentStack = [...(stackHistory[id].at(-1) ?? [])];
      currentStack.pop(); // Remove the top element of the stack
      stackHistory[id].push(currentStack);
    },
  };
};

export const resetStack = () => {
  stackHistory = [];
};

export const syncStack = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === ComponentType.STACK).map(e => e.id)) {
    while (stackHistory[i].length < maxLen) {
      stackHistory[i].push(stackHistory[i].at(-1)!);
    }
  }
};

const StackComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  return <p>{stackHistory[id][frame]?.at(-1) ?? ""}</p>;
};
