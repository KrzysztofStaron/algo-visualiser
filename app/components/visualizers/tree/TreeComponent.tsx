"use client";

import { ComponentType, ids, resetFunctions } from "@/app/components/VisualizerApp";

// Define the TreeNode class
class TreeNode {
  data: any;
  children: TreeNode[];

  constructor(data: any) {
    this.data = data;
    this.children = [];
  }

  // Add a new child node
  add(data: any) {
    this.children.push(new TreeNode(data));
  }

  // Remove a child node by data
  remove(data: any) {
    this.children = this.children.filter(node => node.data !== data);
  }
}

// Define the Tree class
class Tree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  // Add a node to the root (basic structure)
  addRoot(data: any) {
    this.root = new TreeNode(data);
  }
}

// Tree history array for state management
export var treeHis: Array<Array<Tree>> = [];

// Create a tree handler for managing the tree component's state
export const createTreeHandler = (register: CallableFunction, metadata: any) => {
  const id = register(ComponentType.TREE, TreeComponent, metadata);

  // Initialize the history for the new tree
  treeHis[id] = [];

  return {};
};

// Reset the tree history
export const resetTree = () => {
  console.log("resetTree");
  treeHis = [];
};
// Sync the base tree states across all frames
export const syncTree = (maxLen: number) => {
  for (let i of ids.filter(e => e.type === ComponentType.TREE).map(e => e.id)) {
    while (treeHis[i].length < maxLen) {
      treeHis[i].push(treeHis[i].at(-1)!);
    }
  }
};

let pushed = false;
// Define the TreeComponent for rendering the tree
const TreeComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  if (pushed === false) {
    resetFunctions.push(resetTree);
    pushed = true;
  }

  return <p>Tree</p>;
};
