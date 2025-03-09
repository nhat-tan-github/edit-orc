import { SelectEffect } from "@/components/SelectEffect";
import { ActionButton } from "@/components/ActionButton";
import { useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

const RESOLUTION_OPTIONS: SelectOption[] = [
  { value: "auto", label: "Auto" },
  { value: "1080p", label: "1080p" },
  { value: "720p", label: "720p" }
];

const FPS_OPTIONS: SelectOption[] = [
  { value: "auto", label: "Auto" },
  { value: "30", label: "30 FPS" },
  { value: "60", label: "60 FPS" }
];

const ENCODING_OPTIONS: SelectOption[] = [
  { value: "h264", label: "H.264" },
  { value: "hevc", label: "HEVC" }
];

const BITRATE_OPTIONS: SelectOption[] = [
  { value: "medium", label: "Trung Bình" },
  { value: "high", label: "Cao" },
  { value: "low", label: "Thấp" }
];

const FORMAT_OPTIONS: SelectOption[] = [
  { value: "mp4", label: "MP4" },
  { value: "mkv", label: "MKV" },
  { value: "avi", label: "AVI" }
];

export const Render = () => {
  const [selectedAction, setSelectedAction] = useState<string>("none");
  const [resolution, setResolution] = useState("auto");
  const [fps, setFps] = useState("auto");
  const [encoding, setEncoding] = useState("h264");
  const [bitrate, setBitrate] = useState("medium");
  const [format, setFormat] = useState("mp4");

  const handleAction = (action: string) => {
    switch (action) {
      case "backup":
        // Xử lý tải backup
        break;
      case "srt":
        // Xử lý tải SRT
        break;
      case "save":
        // Xử lý lưu
        break;
      case "publish":
        // Xử lý xuất bản
        break;
      case "cancel":
        // Xử lý hủy
        break;
    }
  };

  return (
    <div
      className="modal-container absolute rounded-lg text-white relative overflow-hidden transition-all duration-150 opacity-100 scale-100"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw",
        height: "60vh",
        zIndex: 200,
        background: 'linear-gradient(40deg, rgb(28, 0, 82), rgb(0, 3, 22))',
        isolation: 'isolate',
        boxShadow: '0 0 4px rgba(39, 6, 95, 0.4), 0 0 40px rgba(103, 0, 108, 0.2)',
        borderRadius: '20px',
      }}
    >
      <style>
        {`
          .modal-container.closing {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
        `}
      </style>
      <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="gradients-container absolute inset-0 -z-10" style={{ filter: 'url(#goo) blur(20px)' }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`g${i + 1} absolute w-2/5 h-2/5 opacity-${[30, 30, 30, 20, 25][i]} ${
              i === 3 ? 'animate-move-horizontal' : 'animate-move-in-circle'
            }`}
            style={{
              background: [
                'radial-gradient(circle at center, rgba(0, 0, 0, 1) 0%, rgba(18, 83, 255, 0.3) 20%, rgba(18, 83, 255, 0.3) 50%, rgba(0, 0, 0, 0.95) 80%, rgba(0, 0, 0, 1) 100%)',
                'radial-gradient(circle at center, rgba(0, 0, 0, 1) 0%, rgba(181, 54, 215, 0.3) 20%, rgba(126, 54, 215, 0.3) 50%, rgba(0, 0, 0, 0.95) 80%, rgba(0, 0, 0, 1) 100%)',
                'radial-gradient(circle at center, rgba(0, 0, 0, 1) 0%, rgba(80, 180, 255, 0.3) 20%, rgba(80, 180, 255, 0.3) 50%, rgba(0, 0, 0, 0.95) 80%, rgba(0, 0, 0, 1) 100%)',
                'radial-gradient(circle at center, rgba(0, 0, 0, 1) 0%, rgba(147, 51, 234, 0.3) 20%, rgba(147, 51, 234, 0.3) 50%, rgba(0, 0, 0, 0.95) 80%, rgba(0, 0, 0, 1) 100%)',
                'radial-gradient(circle at center, rgba(0, 0, 0, 1) 0%, rgba(236, 72, 153, 0.3) 20%, rgba(236, 72, 153, 0.3) 50%, rgba(0, 0, 0, 0.95) 80%, rgba(0, 0, 0, 1) 100%)'
              ][i],
              mixBlendMode: 'hard-light',
              top: `${30 + i * 5}%`,
              left: `${30 + i * 5}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <h2 className="mb-2 text-ls">Xuất bản</h2>

        <br />

        {/* Form xuất bản */}
        <div className="grid grid-cols-[1fr_150px] gap-x-4 gap-y-3 max-w-[400px] ml-auto">
          <div className="flex justify-end w-full">
            <label className="self-center text-sm font-medium w-[140px]">
              Độ phân giải:
            </label>
          </div>
          <div className="w-full">
            <SelectEffect
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              options={RESOLUTION_OPTIONS}
              title="Chọn độ phân giải xuất video"
            />
          </div>

          <div className="flex justify-end w-full">
            <label className="self-center text-sm font-medium w-[140px]">
              Tốc độ khung hình:
            </label>
          </div>
          <div className="w-full">
            <SelectEffect
              id="fps"
              value={fps}
              onChange={(e) => setFps(e.target.value)}
              options={FPS_OPTIONS}
              title="Chọn tốc độ khung hình"
            />
          </div>

          <div className="flex justify-end w-full">
            <label className="self-center text-sm font-medium w-[140px]">
              Mã hóa:
            </label>
          </div>
          <div className="w-full">
            <SelectEffect
              id="encoding"
              value={encoding}
              onChange={(e) => setEncoding(e.target.value)}
              options={ENCODING_OPTIONS}
              title="Chọn chuẩn mã hóa video"
            />
          </div>

          <div className="flex justify-end w-full">
            <label className="self-center text-sm font-medium w-[140px]">
              Tốc độ Bit:
            </label>
          </div>
          <div className="w-full">
            <SelectEffect
              id="bitrate"
              value={bitrate}
              onChange={(e) => setBitrate(e.target.value)}
              options={BITRATE_OPTIONS}
              title="Chọn tốc độ bit cho video"
            />
          </div>

          <div className="flex justify-end w-full">
            <label className="self-center text-sm font-medium w-[140px]">
              Định dạng:
            </label>
          </div>
          <div className="w-full">
            <SelectEffect
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={FORMAT_OPTIONS}
              title="Chọn định dạng file xuất"
            />
          </div>
        </div>

        <br />
        <br />

        {/* Nút hành động */}
        <div className="mt-4 flex justify-end gap-2">
          < ActionButton
            label="Tải backup"
            onClick={() => handleAction("backup")}
            variant="tree"
          />
          <ActionButton
            label="Tải .SRT"
            onClick={() => handleAction("srt")}
            variant="pink"
          />
          <ActionButton
            label="Lưu"
            onClick={() => handleAction("save")}
            variant="green"
          />
          <ActionButton
            label="Xuất bản"
            onClick={() => handleAction("publish")}
            variant="blue"
          />
          <ActionButton
            label="Hủy"
            onClick={() => handleAction("cancel")}
            variant="red"
          />
        </div>
      </div>
    </div>
  );
};
