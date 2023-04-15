import { ReactElement } from "react";

const HeaderNav = (): ReactElement => {
  return (
    <header className="w-full flex bg-indigo-700 p-3.5 border-b-2 border-slate-950">
      <nav className="text-white font-semibold text-sm tracking-wider">
        JS/JSON/TS 2 OPEN API
      </nav>
    </header>
  );
};

export default HeaderNav;
