import { useAppStore } from "@/stores/AppStore";
import { ReactElement } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "@/components/editor/style";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const OutputEditor = (): ReactElement => {
  const { mainEditorContent } = useAppStore();
  const { data } = useQuery(["main-editor-parsed"], async () => {
    try {
      const res = await axios.post("/api/parse", { data: mainEditorContent });
      return res.data;
    } catch (e) {
      return "error";
    }
  });

  return (
    <div className="w-full flex-grow">
      <AceEditor
        theme="customTheme"
        mode={"yaml"}
        value={data?.output || "loading..."}
        width={"100%"}
        name="UNIQUE_ID_OF_DIV"
        fontSize={15}
        height={"100%"}
        readOnly
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

export default OutputEditor;
