import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { concatenatedContent } from "./dts.json";
import { apiSuggestions } from "./snippets";

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
