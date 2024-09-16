/**
 * Represents the colors used in a matrix.
 * Maps keys to color values.
 * key: color -> 0: red
 */
declare interface MatrixColor {
  [key: string]: string; // Maps numerical indices to color strings
}
/**
 * Represents a position in a 2D space.
 * Tuple with X and Y coordinates.
 */
declare type Position = [number, number];

/**
 * Represents a matrix object with various methods.
 */
declare interface MatrixObject {
  /**
   * Replaces a value at the given position in the matrix.
   * @param position The position where the replacement occurs.
   * @param value The new value to set.
   * @param synchronize Optional flag to indicate if synchronization is needed.
   */
  replace(position: Position, value: string, synchronize?: boolean): void;

  /**
   * Sets the content of the matrix.
   * @param data 2D array of strings to set as the matrix content.
   * @param synchronize Optional flag to indicate if synchronization is needed.
   */
  content(data: string[][], synchronize?: boolean): void;

  /**
   * Sets the colors for the matrix.
   * @param colors An object mapping indices to color values.
   * @param synchronize Optional flag to indicate if synchronization is needed.
   */
  colors(colors: MatrixColor, synchronize?: boolean): void;

  /**
   * Sets the grouping for the matrix.
   * @param data An array of tuples representing groups.
   * @param synchronize Optional flag to indicate if synchronization is needed.
   */
  group(data: Array<[number, number]>, synchronize?: boolean): void;

  /**
   * Sets the frame of the matrix.
   * @param data An object containing content, colors, and group information.
   * @param synchronize Optional flag to indicate if synchronization is needed.
   */
  frame(data: { content?: string[][]; colors?: MatrixColor; group?: Position[] }, synchronize?: boolean): void;
}

/**
 * Creates a new matrix object.
 * @returns A new MatrixObject instance.
 */
declare const createMatrix: () => MatrixObject;
