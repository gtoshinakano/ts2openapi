import { useQueryClient } from "@tanstack/react-query";
import { ReactElement } from "react";
import { AppState } from "@/stores/AppStore";

const HeaderNav = (): ReactElement => {
  const client = useQueryClient();
  const data = client.getQueryData<Partial<AppState>>(["main-editor-parsed"]);
  console.log(data?.hasError);
  return (
    <header
      className={`w-full flex justify-between ${
        data?.hasError ? "bg-red-500" : "bg-indigo-700"
      } p-3.5 border-b-2 border-slate-950 transform duration-100`}
    >
      <nav className="text-white font-semibold text-sm tracking-wider w-1/5">
        JS/JSON/TS 2 OPEN API
      </nav>
      <nav className="text-white font-light text-sm tracking-wider grow text-center">
        {data?.errorMessage}
      </nav>
      <nav className="text-white font-semibold text-sm tracking-wider w-1/5 text-right">
        Github
      </nav>
    </header>
  );
};

export default HeaderNav;
