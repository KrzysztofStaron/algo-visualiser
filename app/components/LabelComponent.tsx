"use client";

import React from "react";
import { destructValue, ids, sync } from "../page";

export var labelHistory: any[][] = [];

export const labelSync = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === "Label").map(e => e.id)) {
    while (labelHistory[i].length < maxLen) {
      labelHistory[i].push(labelHistory[i].at(-1)!);
    }
  }
};

export const createLabelHandler = (root: any, metadata: any) => {
  const id = root.register("Label", metadata);

  labelHistory[id] = [];

  console.log("Label Created: ", id);

  return {
    text: (data: any, synhronize = true) => {
      labelHistory[id].push(destructValue(data));

      if (synhronize) {
        sync();
      }
    },
  };
};

export const resetLabel = () => {
  labelHistory = [];
};

const LabelComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  const content = labelHistory[id][Math.min(frame, labelHistory[id].length - 1)];
  return (
    <p className="text-3xl">
      {metadata?.pre ?? ""}
      {content}
      {metadata?.post ?? ""}
    </p>
  );
};

export default LabelComponent;
