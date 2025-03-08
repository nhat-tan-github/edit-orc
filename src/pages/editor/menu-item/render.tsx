import { Button } from "@/components/ui/button";

export const Render = () => {

  return (
    <div
      className="absolute rounded-lg bg-background/90 p-4 shadow-lg backdrop-blur-lg backdrop-filter"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw", // Nhỏ gọn hơn
        height: "60vh",
        zIndex: 200,
      }}
    >

      <h2 className="mb-2 text-lg font-semibold">Xuất bản</h2>

      <br />

      {/* Form xuất bản */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <label className="self-center text-right text-sm font-medium">
          Độ phân giải:
        </label>
        <select className="w-full rounded-md border bg-gray-800 px-2 py-1 text-white">
          <option>Auto</option>
          <option>1080p</option>
          <option>720p</option>
        </select>

        <label className="self-center text-right text-sm font-medium">
          Tốc độ khung hình:
        </label>
        <select className="w-full rounded-md border bg-gray-800 px-2 py-1 text-white">
          <option>Auto</option>
          <option>30 FPS</option>
          <option>60 FPS</option>
        </select>

        <label className="self-center text-right text-sm font-medium">
          Mã hóa:
        </label>
        <select className="w-full rounded-md border bg-gray-800 px-2 py-1 text-white">
          <option>H.264</option>
          <option>HEVC</option>
        </select>

        <label className="self-center text-right text-sm font-medium">
          Tốc độ Bit:
        </label>
        <select className="w-full rounded-md border bg-gray-800 px-2 py-1 text-white">
          <option>Trung Bình</option>
          <option>Cao</option>
          <option>Thấp</option>
        </select>

        <label className="self-center text-right text-sm font-medium">
          Định dạng:
        </label>
        <select className="w-full rounded-md border bg-gray-800 px-2 py-1 text-white">
          <option>MP4</option>
          <option>MKV</option>
          <option>AVI</option>
        </select>
      </div>

      <br />
      <br />

      {/* Nút hành động */}
      <div className="mt-4 flex justify-between">
        <div className="flex gap-2">
          <Button className="bg-green-600 px-4 py-2 text-sm">Tải backup</Button>
          <Button className="bg-green-500 px-4 py-2 text-sm">Tải .SRT</Button>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-500 px-4 py-2 text-sm">Lưu</Button>
          <Button className="bg-blue-600 px-4 py-2 text-sm">Xuất bản</Button>
          <Button className="bg-gray-600 px-4 py-2 text-sm">Hủy</Button>
        </div>
      </div>
    </div>
  );
};
