import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

function MonacoEditor() {
  const code = `const matrix = createMatrix();`;

  // Define your custom API suggestions with sortText for ordering
  const apiSuggestions = [
    {
      label: "createMatrix",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "createMatrix()",
      detail: "Returns a MatrixObject",
      documentation: "Creates a new Matrix object.",
      sortText: "001",
    },
    {
      label: "createLabel",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "createLabel()",
      detail: "Returns a LabelObject",
      documentation: "Creates a new Label object.",
      sortText: "002",
    },
    {
      label: "createArray",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "createArray()",
      detail: "Returns an ArrayObject",
      documentation: "Creates a new Array object.",
      sortText: "003",
    },
  ];

  const handleEditorWillMount = (monaco: Monaco) => {
    // Provide TypeScript type definitions
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `
        /**
         * Represents the colors used in a matrix.
         * Maps numerical keys to color values.
         */
        declare interface MatrixColor {
          [key: number]: string; // Maps numerical indices to color strings
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
           * @param data An object mapping indices to color values.
           * @param synchronize Optional flag to indicate if synchronization is needed.
           */
          colors(data: MatrixColor, synchronize?: boolean): void;
    
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
          frame(data: { content?: any[][]; colors?: MatrixColor; group?: Position[] }, synchronize?: boolean): void;
        }
    
        /**
         * Creates a new matrix object.
         * @returns A new MatrixObject instance.
         */
        declare const createMatrix: () => MatrixObject;
      `,
      "ts:filename/factories.d.ts"
    );

    // Optionally set compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
    });

    // Register your completion provider
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model, position) => {
        const suggestions = apiSuggestions.map(api => ({
          label: api.label,
          kind: api.kind,
          insertText: api.insertText,
          detail: api.detail,
          documentation: api.documentation,
          sortText: api.sortText,
          range: model.getFullModelRange(), // Provide a range
        }));

        return {
          suggestions,
        };
      },
    });
  };

  return (
    <Editor
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={code}
      beforeMount={handleEditorWillMount} // Access monaco instance here
      options={{
        fontSize: 16,
        formatOnType: true,
        autoClosingBrackets: "always",
        minimap: { scale: 1 },
        suggestOnTriggerCharacters: true,
      }}
    />
  );
}

export default MonacoEditor;
