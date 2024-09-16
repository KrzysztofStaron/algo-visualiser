"use client";

import { ComponentType, ids } from "@/app/components/VisualizerApp";

export var his: any[] = [];

export const createBase_handler = (register: CallableFunction, metadata: any) => {
  const id = register("", metadata);

  his[id] = [];

  return {};
};

export const resetBase = () => {
  his = [];
};

export const syncBase = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === ComponentType.BASE).map(e => e.id)) {
    while (his[i].length < maxLen) {
      his[i].push(his[i].at(-1)!);
    }
  }
};

const BaseComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  return <p>Base</p>;
};
