import React, { useEffect } from "react";
import { ComponentType, ids, resetFunctions, syncFunctions } from "../../VisualizerApp";

// new TreeNodeHandler([label, [children]])

export class TreeNodeHandler {
  label: string;
  children: TreeNodeHandler[];

  constructor(data: any) {
    if (Array.isArray(data)) {
      this.label = data[0];
      this.children = data[1].map((e: any) => new TreeNodeHandler(e));
    } else {
      this.label = data;
      this.children = [];
    }
  }

  add(data: any) {
    if (data instanceof TreeNodeHandler) {
      this.children.push(data);
    } else if (typeof data === "number" || typeof data === "string") {
      this.children.push(new TreeNodeHandler(data));
    } else if (Array.isArray(data)) {
      this.addArray(data);
      // Add all elements of the array as children
      console.log("array: ", data);
    } else {
      throw new Error("Unsupported data type");
    }
  }

  private addArray(array: any) {
    if (array.length === 0) return;

    // The first element of the array is the label for this node
    const node = new TreeNodeHandler(array[0]);

    // Add each item in the array
    array[1].forEach((item: string | string[]) => {
      if (Array.isArray(item)) {
        // Recursively add children if item is an array
        node.addArray(item);
      } else {
        // Add item directly as a child
        node.add(item);
      }
    });

    // Add the newly created node as a child of the current node
    this.children.push(node);
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
      treeHis[id].push({ ...(data as Object) } as TreeNodeHandler);
    },
  };
};

export const resetTree = () => {
  console.log("treeHis: ", treeHis);
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

  const data = treeHis[id]?.[Math.min(frame, treeHis[id].length - 1)] ?? [];

  const levels = getLevels(data);

  useEffect(() => {
    const handleResize = () => {
      // Calculate the maximum width for nodes at each level
      Object.keys(levels).forEach(level => {
        const elements = document.querySelectorAll(`.node-${level}`);
        const maxWidth = Array.from(elements).reduce((max, el) => Math.max(max, el.clientWidth), 0);

        // Set all nodes at this level to the maximum width
        elements.forEach(el => el.setAttribute("style", `width: ${maxWidth}px;`));
      });
    };

    // Call handleResize initially and also on window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      Object.keys(levels).forEach(level => {
        const elements = document.querySelectorAll(`.node-${level}`);

        // Set all nodes at this level to the maximum width
        elements.forEach(el => el.removeAttribute("style"));
      });

      window.removeEventListener("resize", handleResize);
    };
  }, [levels]);

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
    <div className={`flex flex-col items-center text-white node-${level} gap-2`}>
      <p className="bg-stone-900 p-3 px-5 rounded-full text-center truncate max-w-48 text-lg font-semibold border-black border-4">
        {node.label}
      </p>
      {node.children && (
        <div className="flex flex-row border-t-2 pt-2 gap-4 border-stone-950">
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
