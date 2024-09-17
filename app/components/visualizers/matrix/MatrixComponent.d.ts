/**
 * Represents the colors used in a matrix.
 * Maps numerical keys to color values.
 */
declare interface MatrixColor {
  [key: number]: string; // Maps numerical indices to color strings.
}

/**
 * Represents a position in a 2D space.
 * A tuple containing X and Y coordinates.
 */
declare type Position = [number, number];

/**
 * Represents a matrix object with various methods to manipulate the matrix content, colors, and groups.
 */
declare interface MatrixObject {
  /**
   * Replaces a value at the specified position in the matrix.
   *
   * @param position The coordinates in the matrix where the replacement occurs.
   * @param value The new value to set at the specified position.
   * @param synchronize Optional flag to trigger synchronization after replacement.
   */
  replace(position: Position, value: string, synchronize?: boolean): void;

  /**
   * Sets the content of the matrix.
   *
   * @param data A 2D array of strings representing the matrix content.
   * @param synchronize Optional flag to trigger synchronization after setting content.
   */
  content(data: string[][], synchronize?: boolean): void;

  /**
   * Sets the colors for the matrix.
   *
   * @param colors An object mapping matrix indices to color values.
   *
   * Example:
   * ```ts
   * { 0: "white", 1: "#fff", 2: "bg-white" }
   * ```
   * @param synchronize Optional flag to trigger synchronization after setting colors.
   */
  colors(colors: MatrixColor, synchronize?: boolean): void;

  /**
   * Sets the grouping for the matrix.
   *
   * @param data An array of tuples representing the coordinates of grouped elements.
   * @param synchronize Optional flag to trigger synchronization after setting groups.
   */
  group(data: Array<Position>, synchronize?: boolean): void;

  /**
   * Sets the frame data in the matrix object.
   *
   * The `data` parameter can include:
   * - `content`: A 2D array of strings representing the matrix content.
   * - `colors`: An object mapping indices to color values for the matrix.
   * - `group`: An array of positions representing the grouping in the matrix.
   *
   * Each field is optional. If a field is provided, it will update the respective aspect of the matrix. If not, the existing data for that field will remain unchanged.
   *
   * @param data - An object containing the fields to update:
   *   - `content` (optional): A 2D array of strings representing the matrix content. Example: `[['A', 'B'], ['C', 'D']]`
   *   - `colors` (optional): An object mapping numerical indices to color values. Example: `{0: 'red', 1: 'blue'}`.
   *   - `group` (optional): An array of positions representing the grouping of elements. Each position is a tuple with X and Y coordinates. Example: `[[0, 0], [1, 1]]`.
   * @param synchronize - Optional flag to trigger synchronization after setting the frame data. Defaults to `true`.
   */
  frame(data: { content?: string[][]; colors?: MatrixColor; group?: Position[] }, synchronize?: boolean): void;
}

/**
 * Creates a new MatrixObject instance with methods for manipulating the matrix.
 *
 * @returns A new MatrixObject instance.
 */
declare const createMatrix: () => MatrixObject;
