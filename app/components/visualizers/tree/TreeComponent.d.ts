/**
 * Represents a node in the tree.
 */
declare class TreeNode {
  /**
   * The data contained in the node.
   */
  data: string;

  /**
   * The children of this node.
   */
  children: TreeNode[];

  /**
   * Adds a new child node with the specified data.
   *
   * @param data The data to be added to the new child node.
   */
  add(data: any): void;

  /**
   * Removes a child node containing the specified data.
   *
   * @param data The data of the node to remove.
   */
  remove(data: any): void;
}

/**
 * Represents the tree
 */
declare interface TreeObject {
  /**
   * Sets the content of the tree.
   *
   * @param data A 2D array of strings representing the tree content.
   * @param synchronize Optional flag to trigger synchronization after setting content.
   */
  content(data: Tree, synchronize?: boolean): void;
}

/**
 * Creates a new TreeObject instance with methods for manipulating the tree structure.
 *
 * @returns A new TreeObject instance.
 */
declare const createTree: () => TreeObject;

/**
 * Represents metadata for the TreeComponent.
 */
declare interface TreeMetadata {}
