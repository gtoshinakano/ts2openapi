import { useState } from "react";

type IProps = {
  checked: null | boolean;
  onChange: (name: string, value: null | boolean) => void;
  label: string | string[];
  name: string;
  id?: string;
  triple?: boolean;
  reverse?: boolean;
};

const Switch = ({
  id,
  name,
  label,
  checked,
  onChange,
  triple,
  reverse = false,
}: IProps) => {
  const [state, setState] = useState<null | boolean>(checked);

  const handleChange = () => {
    const newState = triple && state === false ? null : !state;
    setState(newState);
    onChange(name, newState);
  };

  const labelIndex = state ? 1 : 0;
  const labelText =
    typeof label === "string" ? label : label[state === null ? 2 : labelIndex];

  return (
    <div className={`flex w-full ${reverse ? "flex-row-reverse" : "flex-row"}`}>
      <input
        type="checkbox"
        title={label.toString()}
        checked={state || false}
        onChange={handleChange}
        className="hidden"
      />
      <button
        className={`relative rounded-3xl h-5 w-8 py-0.5 shadow-sm border border-zinc-900 flex bg-zinc-900 transition duration-100`}
        onClick={handleChange}
        id={id || name}
        type="button"
        title={labelText}
      >
        <span
          className={`absolute rounded-full aspect-square h-4 w-4 top-1/2 -translate-y-1/2
          ${
            state === null
              ? "bg-red-200 ml-0.5"
              : state
              ? "bg-green-600 ml-3"
              : "bg-slate-600 ml-0.5"
          } transition-all duration-200 delay-100`}
        ></span>
      </button>
      <label
        className="my-auto mx-2 grow select-none text-xs text-zinc-400 font-semibold"
        htmlFor={id || name}
      >
        {labelText}
      </label>
    </div>
  );
};

export default Switch;
