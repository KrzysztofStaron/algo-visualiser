/**
 * Represents a label object
 */
interface LabelObject {
  /**
   * Sets the contents of label
   * @param text The contents of label
   */
  text(text: string): void;
}

interface LabelSettings {
  prefix: string;
  suffix: string;
}

/**
 * @returns A new LabelObject instance.
 */
declare const createLabel: (settings: LabelSettings) => LabelObject;
