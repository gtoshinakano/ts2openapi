"use client";

import { useAppStore } from "@/stores/AppStore";
import dynamic from "next/dynamic";
import { ReactElement, useCallback } from "react";
import Switch from "./ui/Switch";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";

const MainEditor = dynamic(() => import("./editor/MainEditor"), { ssr: false });
const OutputEditor = dynamic(() => import("./editor/OutputEditor"), {
  ssr: false,
});

const queryClient = new QueryClient();

const AppContainer = (): ReactElement => {
  const { hasExample, singleToggle } = useAppStore();

  const toggleExample = useCallback(
    () => singleToggle("hasExample"),
    [singleToggle]
  );
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`flex flex-col ${
          hasExample ? "w-[60vw]" : "w-[50vw]"
        } transform duration-200`}
      >
        <div className="w-full flex pl-10 py-5">
          <div>
            <Switch
              label="EXAMPLE"
              checked={hasExample}
              name="example-toggler"
              onChange={toggleExample}
              reverse
            />
          </div>
        </div>
        <div className="w-full flex flex-grow">
          <div
            className={`${
              hasExample ? "w-[30vw]" : "w-[50vw]"
            } flex flex-grow h-full transform duration-200`}
          >
            <MainEditor />
          </div>
          <div
            className={`${
              hasExample ? "w-[30vw]" : "w-0"
            } flex flex-grow h-full transform duration-200`}
          ></div>
        </div>
      </div>
      <div
        className={`flex flex-col ${
          hasExample ? "w-[40vw]" : "w-[50vw]"
        } transform duration-200`}
      >
        <Switch
          label="EXAMPLE"
          checked={hasExample}
          name="example-toggler"
          onChange={toggleExample}
          reverse
        />
        <div className="w-full flex pl-10 py-5"></div>
        <OutputEditor />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppContainer;
