"use client";

import { useAppStore } from "@/stores/AppStore";
import dynamic from "next/dynamic";
import { ReactElement, useCallback } from "react";
import Switch from "./ui/Switch";

const MainEditor = dynamic(() => import("./editor/MainEditor"), { ssr: false });

const AppContainer = (): ReactElement => {
  const { hasExample, singleToggle } = useAppStore();

  const toggleExample = useCallback(
    () => singleToggle("hasExample"),
    [singleToggle]
  );
  return (
    <>
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
          >
            <MainEditor />
          </div>
        </div>
      </div>
      <div
        className={`flex ${
          hasExample ? "w-[40vw]" : "w-[50vw]"
        } transform duration-200`}
      >
        2
      </div>
    </>
  );
};

export default AppContainer;
