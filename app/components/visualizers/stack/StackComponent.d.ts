/**
 * Represents a stack object with typical stack operations like push and pop.
 */
declare interface StackObject {
  /**
   * Pushes a new value onto the stack.
   *
   * @param value The value to be added to the top of the stack.
   *
   * Example usage:
   * ```ts
   * stack.push("value");
   * ```
   */
  push(value: string | number): void;

  /**
   * Pops the top value from the stack.
   *
   * Example usage:
   * ```ts
   * const topValue = stack.pop();
   * ```
   */
  pop(): void;
}

/**
 * Creates a new stack object.
 *
 * @returns A new StackObject instance.
 *
 * Example usage:
 * ```ts
 * const stack = createStack();
 * stack.push("value");
 * ```
 */
declare const createStack: () => StackObject;
