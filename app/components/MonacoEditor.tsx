import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { concatenatedContent } from "./dts.json";

function MonacoEditor({ code, setCode }: { code: string; setCode: CallableFunction }) {
  // Define your custom API suggestions with sortText for ordering
  const apiSuggestions = [
    {
      label: "matrix()",
      kind: 1,
      insertText: "const matix = createMatrix()",
      detail: "Returns a MatrixObject",
      documentation: "Creates a new Matrix object.",
      sortText: "001",
    },
    {
      label: "label()",
      kind: 1,
      insertText: "const label = createLabel()",
      detail: "Returns a LabelObject",
      documentation: "Creates a new Label object.",
      sortText: "002",
    },
    {
      label: "arr()",
      kind: 1,
      insertText: "const arr = createArray()",
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
