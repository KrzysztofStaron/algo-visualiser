/**
 * Represents a label object.
 */
interface LabelObject {
  /**
   * Sets the contents of the label.
   *
   * @param text - The content to set for the label.
   */
  text(text: string): void;
}

/**
 * Represents the settings used to configure a label.
 */
interface LabelSettings {
  /**
   * The prefix to prepend to the label's content.
   */
  prefix: string;

  /**
   * The suffix to append to the label's content.
   */
  suffix: string;
}

/**
 * Creates a new LabelObject with the specified settings.
 *
 * @param settings - An object containing the `prefix` and `suffix` for the label.
 * @returns A new LabelObject instance.
 */
declare const createLabel: (settings: LabelSettings) => LabelObject;
