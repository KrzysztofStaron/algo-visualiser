import { useState, useRef, useEffect, useMemo } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import data from "./dts.json";

const apiSuggestions = [
  {
    label: "newMatrix",
    kind: monaco.languages.CompletionItemKind.Function,
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
  {
    label: "newStack",
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: "const stack = createStack()",
    detail: "createStack()",
    documentation: "Creates a new Stack object.",
    sortText: "004",
  },
];

function MonacoEditor({ code, setCode }: { code: string; setCode: CallableFunction }) {
  const [editorWidth, setEditorWidth] = useState(600); // Initial width of the editor
  const [startMouseX, setStartMouseX] = useState(0);
  const [renderedWidth, setRenderedWidth] = useState(editorWidth);
  const resizing = useRef(false);

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(data.concatenatedContent, "ts:filename/factories.d.ts");

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
    });

    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = apiSuggestions.map(api => ({
          label: api.label,
          kind: api.kind,
          insertText: api.insertText || api.label,
          detail: api.detail,
          documentation: api.documentation,
          sortText: api.sortText || api.label,
          range: range,
        }));

        return { suggestions };
      },
    });
  };

  // Resize logic
  useEffect(() => {
    const handleMove = (ev: MouseEvent) => {
      if (resizing.current) {
        const newWidth = editorWidth + (ev.clientX - startMouseX);
        setRenderedWidth(Math.min(Math.max(newWidth, 300), 900)); // Minimum width 300px
      }
    };

    const onMouseUp = () => {
      resizing.current = false;
      setEditorWidth(renderedWidth); // Persist the resized width
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [startMouseX, editorWidth, renderedWidth]);

  return (
    <div className="flex h-screen">
      <div style={{ width: `${renderedWidth}px` }}>
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          beforeMount={handleEditorWillMount}
          onChange={v => setCode(v)}
          options={{
            fontSize: 16,
            formatOnType: true,
            autoClosingBrackets: "always",
            minimap: { enabled: false },
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>

      {/* Resize handle */}
      <div
        className="w-1 h-full bg-gray-300 cursor-ew-resize"
        onMouseDown={ev => {
          resizing.current = true;
          setStartMouseX(ev.clientX);
        }}
      ></div>
    </div>
  );
}

export default MonacoEditor;
