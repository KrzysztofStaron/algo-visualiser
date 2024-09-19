import { ComponentType, ids, resetFunctions, syncFunctions } from "../../VisualizerApp";
import React from "react";

export class TreeNodeHandler {
  data: string;
  children: TreeNodeHandler[];

  constructor(data: any) {
    this.data = data;
    this.children = [];
  }

  add(data: any) {
    this.children.push(new TreeNodeHandler(data));
  }

  remove(data: any) {
    this.children = this.children.filter(node => node.data !== data);
  }

  traverse(callback: (node: TreeNodeHandler) => void) {
    callback(this);
    this.children.forEach(child => child.traverse(callback));
  }
}

export var treeHis: Array<Array<TreeNodeHandler>> = [];

export const createTreeHandler = (register: CallableFunction, metadata: any) => {
  const id = register(ComponentType.TREE, TreeComponent, metadata);

  treeHis[id] = [];

  return {
    content: (data: TreeNodeHandler) => {
      treeHis[id].push(data);
    },
  };
};

export const resetTree = () => {
  treeHis = [];
};

export const syncTree = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === ComponentType.TREE).map(e => e.id)) {
    while (treeHis[i].length < maxLen) {
      treeHis[i].push(treeHis[i].at(-1)!);
    }
  }
};

let pushed = false;

const TreeComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  if (!pushed) {
    resetFunctions.push(resetTree);
    syncFunctions.push(syncTree);
    pushed = true;
  }

  // Get the current frame of the tree
  const treeRoot = treeHis[id]?.[Math.min(frame, treeHis[id].length - 1)] ?? null;

  return <>Tree</>;
};
