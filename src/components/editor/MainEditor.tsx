import { useAppStore } from "@/stores/AppStore";
import { ReactElement, useCallback, useState } from "react";
import AceEditor from "react-ace";
import { useQueryClient } from "@tanstack/react-query";

import "ace-builds/src-noconflict/mode-typescript";
import "@/components/editor/style";

const MainEditor = (): ReactElement => {
  const { mainEditorContent, inputType, singleChange } = useAppStore();
  const client = useQueryClient();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const fetchDebouncedData = useCallback(async () => {
    client.fetchQuery(["main-editor-parsed"]);
  }, [client]);

  const onChange = useCallback(
    (value: string) => {
      singleChange("mainEditorContent", value);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setTimeoutId(
        setTimeout(() => {
          fetchDebouncedData();
        }, 100)
      );
    },
    [singleChange, timeoutId, fetchDebouncedData]
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
        debounceChangePeriod={1000}
        tabSize={2}
      />
    </div>
  );
};

export default MainEditor;
