import typer from "@/utils/typer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AppState {
  hasExample: boolean;
  mainEditorContent: string;
  hasError: boolean;
  inputType: string;
  output: string;
  errorMessage: string;
  singleChange: (name: keyof AppState, value: string) => void;
  singleToggle: (name: keyof AppState) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        hasExample: false,
        mainEditorContent: "",
        hasError: false,
        inputType: "typescript",
        output: "",
        errorMessage: "",
        singleChange: (name, value) =>
          set((state) => ({ ...state, [name]: value })),
        singleToggle: (name) =>
          set((state) => ({ ...state, [name]: !state[name] })),
      }),
      {
        name: "AppState",
      }
    )
  )
);
