import React, { useState } from "react";
import { Editor, PrismEditor } from "prism-react-editor";
import { BasicSetup } from "prism-react-editor/setups";

// Importing the required language grammars and features
import "prism-react-editor/prism/languages/jsx";

// Required layout and theme CSS
import "prism-react-editor/layout.css";
import "prism-react-editor/themes/github-dark.css";
import "prism-react-editor/search.css";

// Extensions for bracket matching, indent guides, and autocomplete
import { useBracketMatcher } from "prism-react-editor/match-brackets";
import { IndentGuides } from "prism-react-editor/guides";
import { useCursorPosition } from "prism-react-editor/cursor";
import { useAutoComplete } from "prism-react-editor/autocomplete";

import {
  AutoCompleteConfig,
  completeSnippets,
  fuzzyFilter,
  registerCompletions,
} from "prism-react-editor/autocomplete";
import {
  completeIdentifiers,
  completeKeywords,
  jsContext,
  jsDocCompletion,
  jsxTagCompletion,
  globalReactAttributes,
  reactTags,
  jsSnipets,
} from "prism-react-editor/autocomplete/javascript";

import "./auto.css";
import "./icons.css";

// Configuration for autocomplete
const autocompleteConfig: AutoCompleteConfig = {
  filter: fuzzyFilter,
};

// Register completions for JavaScript, JSX, TypeScript, and TSX
registerCompletions(["javascript"], {
  context: jsContext,
  sources: [
    completeIdentifiers(), // Autocompletes variable names and identifiers
    completeKeywords, // Autocompletes keywords like `const`, `let`, etc.
    jsDocCompletion, // Provides JSDoc completion support
    jsxTagCompletion(reactTags, globalReactAttributes), // Autocompletes JSX tags and attributes
    completeSnippets(jsSnipets), // Provides common JS and JSX snippets
  ],
});

// Define custom editor extensions
function MyExtensions({ editor }: { editor: PrismEditor }) {
  useCursorPosition(editor); // Enable cursor position tracking
  useAutoComplete(editor, autocompleteConfig); // Enable autocompletion

  return (
    <>
      <IndentGuides editor={editor} /> {/* Show indentation guides */}
      {useBracketMatcher(editor)} {/* Enable bracket matching */}
    </>
  );
}

export function PrismCodeEditor({ setCode }: { setCode: CallableFunction }) {
  return (
    <Editor
      value={"const foo = 'bar';"}
      language="javascript" // Set the initial language of the editor
      style={{ height: "100%" }} // Set the editor height
      onUpdate={newCode => {
        setCode(newCode);
      }}
    >
      {editor => (
        <>
          <MyExtensions editor={editor} /> {/* Initialize editor extensions */}
        </>
      )}
    </Editor>
  );
}

export default PrismCodeEditor;
