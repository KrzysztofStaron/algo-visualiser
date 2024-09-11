/**
 * Represents metadata used in ArrayComponent
 */
interface ArrayMetadata {
  /**
   * The orientation of the array component, e.g., "v" for vertical
   */
  orientation?: string;

  /**
   * Whether the component should animate
   */
  anim?: boolean;
}

/**
 * Represents the data used in the frame method
 */
interface ArrayFrameData {
  /**
   * The index to set in the array history
   */
  index?: number;

  /**
   * The group to set in the group history
   */
  group?: number[];

  /**
   * The content to set in the array history
   */
  content?: any[];
}

/**
 * Creates a handler for array operations.
 * @param root The root object for registering the handler
 * @param metadata Metadata for configuring the handler
 * @returns An object with methods to interact with array history
 */
export function createArray(metadata: ArrayMetadata): {
  /**
   * Sets the group data in the group history
   * @param data The group data to set
   * @param synchronize Whether to synchronize the data
   */
  group(data: number[], synchronize?: boolean): void;

  /**
   * Sets the index data in the index history
   * @param data The index data to set
   * @param synchronize Whether to synchronize the data
   */
  setIndex(data: number, synchronize?: boolean): void;

  /**
   * Sets the array data in the array history
   * @param data The array data to set
   * @param synchronize Whether to synchronize the data
   */
  setArr(data: string[], synchronize?: boolean): void;

  /**
   * Sets the frame data in the histories
   * @param data The frame data to set
   * @param synchronize Whether to synchronize the data
   */
  frame(data: ArrayFrameData, synchronize?: boolean): void;
};
