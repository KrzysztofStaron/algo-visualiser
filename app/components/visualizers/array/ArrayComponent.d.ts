/**
 * Represents metadata used in the ArrayComponent.
 */
interface ArrayMetadata {
  /**
   * The orientation of the array component, e.g., "v" for vertical, or "" for horizontal.
   */
  orientation?: "v" | "";

  /**
   * Whether the component should animate.
   */
  anim?: boolean;
}

/**
 * Represents an object with methods for managing an array's data and history.
 */
interface ArrayObject {
  /**
   * Sets the group data in the group history.
   *
   * @param data - An array of numbers representing the group data to be set.
   * @param synchronize - Optional flag to trigger synchronization after setting the group data. Defaults to `true`.
   */
  group(data: number[], synchronize?: boolean): void;

  /**
   * Sets the index data in the index history.
   *
   * @param data - A number representing the index to be set.
   * @param synchronize - Optional flag to trigger synchronization after setting the index data. Defaults to `true`.
   */
  setIndex(data: number, synchronize?: boolean): void;

  /**
   * Sets the array data in the array history.
   *
   * @param data - An array of strings representing the array content to be set.
   * @param synchronize - Optional flag to trigger synchronization after setting the array data. Defaults to `true`.
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
   * @param data - An object containing the fields to update:
   *   - `index` (optional): A number representing the index to set.
   *   - `group` (optional): An array of numbers representing the group to set.
   *   - `content` (optional): An array of strings representing the content to set.
   * @param synchronize - Optional flag to trigger synchronization after setting the frame data. Defaults to `true`.
   */
  frame(data: { index?: number; group?: number[]; content?: string[] }, synchronize?: boolean): void;
}

/**
 * Represents the possible orientation settings for an array component.
 * - `"v"`: Vertical orientation.
 * - `""`: Horizontal or default orientation.
 */
type Orientation = "v" | "";

/**
 * Represents the settings for creating an array component.
 */
interface ArraySettings {
  orientation?: Orientation;
}

/**
 * Creates a new ArrayObject with the specified settings.
 *
 * @param settings - An object containing the optional `orientation` setting.
 * @returns A new ArrayObject instance.
 */
declare const createArray: (settings: ArraySettings) => ArrayObject;
