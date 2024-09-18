"use client";

import { ComponentType, destructValue, ids, resetFunctions, syncFunctions } from "@/app/components/VisualizerApp";

// Initialize stackHistory with type safety
export var stackHistory: Array<Array<(number | string)[]>> = [];

/**
 * Creates a stack handler for managing stack operations.
 * @param register - Function to register the stack component.
 * @param metadata - Metadata for the stack component.
 * @returns Object with push and pop methods for stack operations.
 */
export const createStackHandler = (register: CallableFunction, metadata: any) => {
  const id = register(ComponentType.STACK, StackComponent, metadata);

  // Ensure the stackHistory array has a place for the new stack
  if (!stackHistory[id]) {
    stackHistory[id] = [];
  }

  return {
    /**
     * Pushes a value onto the stack.
     * @param val - The value to push onto the stack.
     */
    push: (val: string) => {
      // Create a new stack entry with the value added
      const newStack = [...(stackHistory[id].at(-1) ?? []), destructValue(val)];
      stackHistory[id].push(newStack);
    },

    /**
     * Pops the top value off the stack.
     */
    pop: () => {
      const currentStack = stackHistory[id].at(-1) ?? [];
      if (currentStack.length > 0) {
        const newStack = [...currentStack];
        newStack.pop(); // Remove the top element of the stack
        stackHistory[id].push(newStack);
      } else {
        console.warn(`Attempted to pop from an empty stack with ID ${id}`);
      }
    },
  };
};

/**
 * Resets all stack histories.
 */
export const resetStack = () => {
  stackHistory = [];
};

/**
 * Synchronizes stack histories to ensure all stacks have the same length.
 * @param maxLen - The maximum length to synchronize to.
 */
export const syncStack = (maxLen: number) => {
  ids
    .filter(e => e.type === ComponentType.STACK)
    .forEach(e => {
      const id = e.id;
      if (id >= stackHistory.length) {
        console.warn(`Stack with ID ${id} does not exist in stackHistory.`);
        return;
      }
      while (stackHistory[id].length < maxLen) {
        stackHistory[id].push(stackHistory[id].at(-1)!);
      }
    });
};

/**
 * Stack component to render the stack's visual representation.
 * @param id - The ID of the stack.
 * @param frame - The current frame of the stack.
 * @param metadata - Metadata for the stack component.
 * @returns JSX Element representing the stack.
 */
let pushed = false;
const StackComponent = ({ id, frame, metadata }: { id: number; frame: number; metadata: any }) => {
  if (pushed === false) {
    resetFunctions.push(resetStack);
    syncFunctions.push(syncStack);

    pushed = true;
  }

  // Ensure the frame is within bounds
  const stackFrame = stackHistory[id]?.[Math.min(frame, stackHistory[id].length - 1)] ?? [];

  return (
    <div className="flex flex-col gap-1">
      {stackFrame.map((data, i) => (
        <Box key={i} data={data} active={i === stackFrame.length - 1} secoundaryActive={false} animate={false} />
      ))}
    </div>
  );
};

/**
 * Box component to render individual stack items.
 * @param data - The data to display in the box.
 * @param active - Whether the box is the active item.
 * @param secoundaryActive - Whether the box is secondarily active.
 * @param animate - Whether the box should animate.
 * @returns JSX Element representing a box.
 */
const Box = ({
  data,
  active,
  secoundaryActive,
  animate,
}: {
  data: any;
  active: boolean;
  secoundaryActive: boolean;
  animate: boolean;
}) => {
  let bgColor = active ? "bg-sky-900" : "bg-stone-900";
  if (secoundaryActive) {
    bgColor = "bg-orange-800";
  }

  return (
    <div
      className={`w-20 h-20 text-3xl flex items-center justify-center border-4 border-gray-950 ${bgColor} text-white ${
        animate ? "transition-all duration-100 ease" : ""
      }`}
    >
      <span>{data ?? ""}</span>
    </div>
  );
};
