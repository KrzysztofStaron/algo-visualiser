import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { concatenatedContent } from "./dts.json";

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
    monaco.languages.typescript.javascriptDefaults.addExtraLib(concatenatedContent, "ts:filename/factories.d.ts");

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
