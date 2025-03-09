import { useState } from "react";
import waveTop from "@/assets/wave-top.png";
import waveMid from "@/assets/wave-mid.png";
import waveBot from "@/assets/wave-bot.png";
import { ActionButton } from "@/components/ActionButton";

const waveAnimations = {
  moveWaveTop: `
    @keyframes moveWaveTop {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `,
  moveWaveMiddle: `
    @keyframes moveWaveMiddle {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `,
  moveWaveBottom: `
    @keyframes moveWaveBottom {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `
};

export const Dubbing = () => {
  const [checked, setChecked] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case "cancel":
        // Xử lý hủy
        break;
      case "dubbing":
        // Xử lý lồng tiếng
        break;
    }
  };

  return (
    <div
      className="modal-container absolute rounded-lg p-6 shadow-lg overflow-hidden transition-all duration-150 opacity-100 scale-100"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw",
        height: "60vh",
        zIndex: 200,
      }}
    >
      <style>
        {Object.values(waveAnimations).join('\n')}
        {`
          .modal-container.closing {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
        `}
      </style>
      {/* Wave Animation Wrapper */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#86377b] via-[#27273c] to-[#27273c]">
          {/* Top Wave */}
          <div className="absolute inset-x-0 bottom-0 z-[15] opacity-50 h-[200px]">
            <div 
              className="absolute left-0 w-[400%] h-full bg-repeat-x"
              style={{
                backgroundImage: `url(${waveTop})`,
                backgroundPosition: "0 bottom",
                backgroundSize: "25% 100%",
                transformOrigin: "center bottom",
                animation: "moveWaveTop 30s linear infinite",
              }}
            />
          </div>

          {/* Middle Wave */}
          <div className="absolute inset-x-0 bottom-0 z-[10] opacity-75 h-[200px]">
            <div 
              className="absolute left-0 w-[400%] h-full bg-repeat-x"
              style={{
                backgroundImage: `url(${waveMid})`,
                backgroundPosition: "0 bottom",
                backgroundSize: "25% 100%",
                transformOrigin: "center bottom",
                animation: "moveWaveMiddle 10s linear infinite",
              }}
            />
          </div>

          {/* Bottom Wave */}
          <div className="absolute inset-x-0 bottom-0 z-[5] h-[200px]">
            <div 
              className="absolute left-0 w-[400%] h-full bg-repeat-x"
              style={{
                backgroundImage: `url(${waveBot})`,
                backgroundPosition: "0 bottom",
                backgroundSize: "25% 100%",
                transformOrigin: "center bottom",
                animation: "moveWaveBottom 20s linear infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <h2 className="mb-2 text-ls text-white">Lồng Tiếng</h2>

        <div className="grid grid-cols-2 gap-6 mt">
          {/* Video Frame - Left Column */}
          <div className="w-full h-full p-4 bg-black/20 rounded-lg backdrop-blur-sm flex items-center justify-center ">
            <div className="w-48 h-36 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-[#883df2] transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-700/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm text-gray-400">Video Preview</span>
            </div>
          </div>

          {/* Controls - Right Column */}
          <div className="flex flex-col items-end gap-6 mt-24">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-white">
                Xuất bản sau khi lồng tiếng
              </label>
              <div
                className={`h-6 w-6 flex items-center justify-center border border-gray-400 rounded cursor-pointer ${
                  checked ? "bg-[#883df2] border-white" : "bg-black/70"
                }`}
                onClick={() => setChecked(!checked)}
              >
                {checked && <span className="text-white text-lg">✔</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <ActionButton
                label="Hủy"
                onClick={() => handleAction("cancel")}
                variant="red"
              />
              <ActionButton
                label="Lồng tiếng"
                onClick={() => handleAction("dubbing")}
                variant="blue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
