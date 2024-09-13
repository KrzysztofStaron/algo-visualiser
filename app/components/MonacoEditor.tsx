import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { concatenatedContent } from "./dts.json";

const apiSuggestions = [
  {
    label: "newMatrix",
    kind: monaco.languages.CompletionItemKind.Function, // Use monaco's enum directly
    insertText: "const matrix = createMatrix()",
    detail: "createMatrix()",
    documentation: "Creates a new Matrix object.",
    sortText: "001",
  },
  {
    label: "newLabel",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "const label = createLabel()",
    detail: "createLabel()",
    documentation: "Creates a new Label object.",
    sortText: "002",
  },
  {
    label: "newArray",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "const arr = createArray()",
    detail: "createArray()",
    documentation: "Creates a new Array object.",
    sortText: "003",
  },
];

function MonacoEditor({ code, setCode }: { code: string; setCode: CallableFunction }) {
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
        const word = model.getWordUntilPosition(position); // Get the current word
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber, // Ensure it's on the same line
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = apiSuggestions.map(api => ({
          label: api.label,
          kind: api.kind,
          insertText: api.insertText || api.label, // Fallback to label if insertText is missing
          detail: api.detail,
          documentation: api.documentation,
          sortText: api.sortText || api.label, // Simple sort text based on label
          range: range, // Correct range on the same line
        }));

        return { suggestions };
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
      onChange={v => setCode(v)}
      options={{
        fontSize: 16,
        formatOnType: true,
        autoClosingBrackets: "always",
        minimap: { enabled: false },
        suggestOnTriggerCharacters: true,
      }}
    />
  );
}

export default MonacoEditor;
