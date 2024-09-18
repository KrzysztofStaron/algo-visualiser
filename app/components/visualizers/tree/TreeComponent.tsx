import { ComponentType, ids, resetFunctions, syncFunctions } from "@/app/components/VisualizerApp";

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

export var treeHis: Array<Array<Tree>> = [];

export const createTreeHandler = (register: CallableFunction, metadata: any) => {
  const id = register(ComponentType.TREE, TreeComponent, metadata);

  treeHis[id] = [];

  return {};
};

export const resetTree = () => {
  console.log("resetTree");
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
  if (pushed === false) {
    resetFunctions.push(resetTree);
    syncFunctions.push(syncTree);
    pushed = true;
  }

  return <p>Tree</p>;
};
