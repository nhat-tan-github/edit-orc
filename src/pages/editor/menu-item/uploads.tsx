import React, { useRef, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {FormUpload} from "./form-upload";
import { OptionUpload } from "./upload-option";
import { ActionButton } from "@/components/ActionButton";

export const Uploads = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleAction = (action: string) => {
    if (action === "cancel") {
      setSelectedFile(null);
      setUploadStatus(null);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setUploadStatus(null); // Reset status when new file is selected
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      console.error("Chưa chọn tệp nào.");
      alert("Vui lòng chọn một tệp video.");
      return;
    }
  
    const formData = new FormData();
    formData.append("video", selectedFile);
  
    const apiUrl = "http://localhost:8000/api/v1/videos/upload";
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0YXBpIiwidWlkIjoiOTExM2ViZDYtMWNmOS00MDM5LWJiMzQtZjMwMzhmYzEzYmU5Iiwiaml0IjoiZTVkOTdhZDAtOTBiOS00NmM3LTg5Y2UtZmMxMWJlYjM1MzZhIiwiZXhwIjoxNzQzNzIyNDE3fQ.prsK32oHvytE15ASJSqxhZXv_-OhQogS6aMAQP1DxMc";
  
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Sử dụng XMLHttpRequest để theo dõi tiến trình tải lên
      const xhr = new XMLHttpRequest();
      
      // Theo dõi sự kiện tiến trình
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      // Promise wrapper cho XMLHttpRequest
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (e) {
              reject(new Error('Lỗi khi phân tích phản hồi từ máy chủ'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(errorData);
            } catch (e) {
              reject(new Error(`Lỗi máy chủ: ${xhr.status}`));
            }
          }
        };
        
        xhr.onerror = () => reject(new Error('Lỗi kết nối mạng'));
        xhr.ontimeout = () => reject(new Error('Yêu cầu hết thời gian chờ'));
      });
      
      // Thiết lập và gửi yêu cầu
      xhr.open('POST', apiUrl, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.send(formData);
      
      // Đợi kết quả từ promise
      const data = await uploadPromise;
      
      console.log("Upload thành công:", data);
      setUploadStatus({ success: true, message: `Video "${selectedFile.name}" đã được upload thành công!` });
      // Reset file input sau khi upload thành công
      setSelectedFile(null);
      if (inputFileRef.current) inputFileRef.current.value = "";
    } catch (error) {
      console.error("Lỗi upload:", error);
      setUploadStatus({ 
        success: false, 
        message: error.message || 'Đã xảy ra lỗi khi tải lên video'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-[linear-gradient(40deg,rgb(0,1,18),rgb(0,2,36))]">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium ">
        Tải lên
      </div>
      <input
        onChange={handleFileChange}
        ref={inputFileRef}
        type="file"
        className="hidden"
        accept="image/*,audio/*,video/*"
      />
      <div className="px-0 py-0 ">
        <Tabs defaultValue="projects" className="w-full">
          <TabsContent value="projects">
            <FormUpload onFileSelected={setSelectedFile} selectedFile={selectedFile} />  
            <div className="relative">
              <OptionUpload />
              <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg backdrop-filter rounded-lg shadow-lg p-4">
                {selectedFile && (
                  <div className="mb-2 text-sm text-green-500">
                    File đã chọn: <strong>{selectedFile.name}</strong> ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <ActionButton
                    label="Hủy"
                    onClick={() => handleAction("cancel")}
                    variant="red"
                  />
                  <ActionButton
                    label={isUploading ? "Đang tải lên..." : selectedFile ? "Xác nhận tải lên" : "Xác nhận"}
                    onClick={handleConfirm}
                    variant="blue"
                    disabled={isUploading || !selectedFile}
                  />
                </div>
                {uploadStatus && (
                  <div
                    className={`mt-2 text-sm ${
                      uploadStatus.success ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {uploadStatus.message}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="workspace">
            {/* <Button
              onClick={() => {
                inputFileRef.current?.click();
              }}
              className="flex w-full gap-2"
              variant="secondary"
            >
              <UploadIcon size={16} /> Upload
            </Button> */}
          </TabsContent>
        </Tabs>
      </div>
      <ScrollArea>
        <div className="masonry-sm px-4"></div>
      </ScrollArea>
    </div>
  );
};