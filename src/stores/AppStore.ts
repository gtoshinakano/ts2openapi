import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppState {
  hasExample: boolean;
  mainEditorContent: string;
  singleChange: (name: keyof AppState, value: string) => void;
  singleToggle: (name: keyof AppState) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        hasExample: false,
        mainEditorContent: "",
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
