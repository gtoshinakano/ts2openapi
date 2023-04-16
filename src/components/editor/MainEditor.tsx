import { useAppStore } from "@/stores/AppStore";
import { ReactElement, useCallback } from "react";
import AceEditor from "react-ace";
import typer from "@/utils/typer";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-typescript";
import "@/components/editor/style";

const MainEditor = (): ReactElement => {
  const { mainEditorContent, singleChange, inputType } = useAppStore();

  const onChange = useCallback(
    (value: string) => singleChange("mainEditorContent", value),
    [singleChange]
  );

  return (
    <div className="w-full flex-grow">
      <AceEditor
        theme="customTheme"
        mode={inputType}
        value={mainEditorContent}
        width={"100%"}
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        fontSize={15}
        height={"100%"}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          enableMultiselect: true,
        }}
        showPrintMargin={false}
        tabSize={2}
      />
    </div>
  );
};

export default MainEditor;
