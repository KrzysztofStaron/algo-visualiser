import { Editor } from "prism-react-editor";
import { BasicSetup } from "prism-react-editor/setups";

// Adding the JSX grammar
import "prism-react-editor/prism/languages/jsx";

// Adds comment toggling and auto-indenting for JSX
import "prism-react-editor/languages/jsx";

import "prism-react-editor/layout.css";
import "prism-react-editor/themes/github-dark.css";

// Required by the basic setup
import "prism-react-editor/search.css";

export function PrismCodeEditor() {
  return (
    <div className="h-full">
      <Editor language="jsx" value="const foo = 'bar'" style={{ height: "100%" }}>
        {editor => <BasicSetup editor={editor} />}
      </Editor>
    </div>
  );
}
