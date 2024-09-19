import React, { useEffect } from "react";
import { ComponentType, ids, resetFunctions, syncFunctions } from "../../VisualizerApp";

export class TreeNodeHandler {
  label: string;
  children: TreeNodeHandler[];

  constructor(data: any) {
    this.label = data;
    this.children = [];
  }

  add(data: any) {
    this.children.push(new TreeNodeHandler(data));
  }

  remove(data: any) {
    this.children = this.children.filter(node => node.label !== data);
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

  const data = {
    label: "root",
    children: [
      {
        label: "adam",
        children: [
          {
            label: "adam-child",
            children: [
              {
                label: "adam-child-child",
              },
            ],
          },
          {
            label: "adam-child-2",
          },
        ],
      },
      {
        label: "eva",
      },
    ],
  };

  const levels = getLevels(data);
  const maxWidthByLevel = getMaxWidthByLevel(levels);
  console.log("maxW: ", maxWidthByLevel);
  console.log("levels: ", levels);
  console.log("data:", data);

  useEffect(() => {
    const handleResize = () => {
      // Calculate the maximum width for nodes at this level
      const elements = document.querySelectorAll(`.node`);
      const maxWidth = Array.from(elements).reduce((max, el) => Math.max(max, el.clientWidth), 0);

      // Set all nodes at this level to the maximum width
      elements.forEach(el => el.setAttribute("style", `width: ${maxWidth}px;`));
    };

    // Call handleResize initially and also on window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <TreeRow node={data} level={0} />;
};

// Recursive component to render tree structure
const TreeRow = ({ node, level }: { node: any; level: number }) => {
  useEffect(() => {
    const handleResize = () => {
      // Calculate the maximum width for nodes at this level
      const elements = document.querySelectorAll(`.node-${level}`);
      const maxWidth = Array.from(elements).reduce((max, el) => Math.max(max, el.clientWidth), 0);

      // Set all nodes at this level to the maximum width
      elements.forEach(el => el.setAttribute("style", `width: ${maxWidth}px;`));
    };

    // Call handleResize initially and also on window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [level]);

  if (!node) return null;

  return (
    <div className={`flex flex-col items-center m-4 text-black node-${level}`}>
      <div className="bg-gray-300 p-5 rounded-full text-center truncate node">{node.label}</div>
      {node.children && (
        <div className="flex flex-row justify-center gap-5">
          {node.children.map((child: any, index: number) => (
            <TreeRow key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// Function to traverse the tree and determine levels
const getLevels = (node: any, level = 0, levels: Record<number, any[]> = {}): Record<number, any[]> => {
  if (!levels[level]) levels[level] = [];
  levels[level].push({ ...node, level });

  if (node.children) {
    node.children.forEach((child: any) => getLevels(child, level + 1, levels));
  }

  return levels;
};

// Function to calculate the maximum width for each level
const getMaxWidthByLevel = (levels: Record<number, any[]>): Record<number, number> => {
  const maxWidthByLevel: Record<number, number> = {};

  Object.keys(levels).forEach((level: any) => {
    const width = Math.max(
      ...levels[level].map((node: any) => node.label.length * 10) // Approximation for width
    );
    maxWidthByLevel[level] = width + 20; // Add padding for aesthetics
  });

  return maxWidthByLevel;
};
