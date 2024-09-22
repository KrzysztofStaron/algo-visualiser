type NodeAsArray = [string, [[key: string | TreeNode | NodeAsArray]]];

/**
 * Represents a node in the tree.
 */
declare class TreeNode {
  /**
   * The data contained in the node.
   */
  data: string;

  /**
   * Is the node highligted
   */
  active: boolean;

  /**
   * Should make path from parent to node blue
   */
  showPathFromParent: boolean;

  /**
   * The children of this node.
   */
  children: TreeNode[];

  /**
   * Adds a new child node with the specified data.
   *
   * @param data The data to be added to the new child node.
   */
  add(data: TreeNode | NodeAsArray): void;

  /**
   * Sets highligting for a node
   *
   * @param val highlight or not to highlight it is a question
   */
  setHighlighting(val: boolean): void;

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
   * @param data The tree data
   * @param synchronize Optional flag to trigger synchronization after setting content.
   */
  content(data: TreeNode, synchronize?: boolean): void;
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
