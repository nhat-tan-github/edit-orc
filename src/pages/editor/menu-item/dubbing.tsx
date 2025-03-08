import { useState } from "react";

export const Dubbing = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      className="absolute rounded-lg bg-background/90 p-6 shadow-lg backdrop-blur-lg backdrop-filter"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw",
        height: "60vh",
        zIndex: 200,
      }}
    >
      <h2 className="mb-4 text-lg font-semibold">Lồng Tiếng</h2>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 items-center">
        <label className="text-sm font-medium text-right">
          Độ phân giải:
        </label>
        <div
          className={`h-6 w-6 flex items-center justify-center border border-gray-400 rounded cursor-pointer mr-96 ${
            checked ? "bg-blue-700 border-white" : "bg-black/70"
          }`}
          onClick={() => setChecked(!checked)}
        >
          {checked && <span className="text-white text-lg">✔</span>}
        </div>
      </div>
    </div>
  );
};
