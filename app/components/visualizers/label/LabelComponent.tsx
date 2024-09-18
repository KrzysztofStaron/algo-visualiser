"use client";

import React from "react";
import { ComponentType, destructValue, ids, resetFunctions, sync, syncFunctions } from "@/app/components/VisualizerApp";

export var labelHistory: Array<Array<string>> = [];

export const syncLabel = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === ComponentType.LABEL).map(e => e.id)) {
    while (labelHistory[i].length < maxLen) {
      labelHistory[i].push(labelHistory[i].at(-1)!);
    }
  }
};

export const createLabelHandler = (register: CallableFunction, metadata: any) => {
  const id = register(ComponentType.LABEL, LabelComponent, metadata);

  labelHistory[id] = [];

  return {
    text: (data: any, synchronize = true) => {
      labelHistory[id].push(destructValue(data));

      if (synchronize) {
        sync();
      }
    },
  };
};

export const resetLabel = () => {
  labelHistory = [];
};

let pushed = false;

const LabelComponent: React.FC<{ id: number; frame: number; metadata: any }> = ({ id, frame, metadata }) => {
  if (pushed === false) {
    resetFunctions.push(resetLabel);
    syncFunctions.push(syncLabel);

    pushed = true;
  }

  const content = labelHistory[id][Math.min(frame, labelHistory[id].length - 1)];
  return (
    <p className="text-3xl">
      {metadata?.prefix ?? ""}
      {content}
      {metadata?.suffix ?? ""}
    </p>
  );
};

export default LabelComponent;
