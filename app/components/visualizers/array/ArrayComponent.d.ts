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

interface ArrayObject {
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
   * Sets the frame data in the histories.
   *
   * The `data` parameter can include:
   * - `index`: The index to set in the index history.
   * - `group`: The group to set in the group history.
   * - `content`: The content to set in the array history.
   *
   * Each field is optional. If a field is provided, it will update the respective history. If not, the existing data for that field will remain unchanged.
   *
   * @param data - The data to set in the histories. It can have the following properties:
   *   - `index` (optional): A number representing the index to be set.
   *   - `group` (optional): An array of numbers representing the group to be set.
   *   - `content` (optional): An array of strings representing the content to be set.
   * @param synchronize - Whether to synchronize the data. Defaults to `true`.
   */
  frame(data: { index?: number; group?: number[]; content?: string[] }, synchronize?: boolean): void;
}

declare const createArray: (settings: ArraySettings) => ArrayObject;
