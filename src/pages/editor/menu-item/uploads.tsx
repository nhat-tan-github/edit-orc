import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UploadIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createUploadsDetails } from "@/utils/upload"; // hàm tạo presigned URL
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO } from "@designcombo/state";
import {FormUpload} from "./form-upload";
import { OptionUpload } from "./upload-option";
import { ButtonEffect } from "@/components/ButtonEffect";

export const Uploads = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onInputFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    try {
      // Tạo thông tin upload (presigned URL, url, name, id)
      const uploadDetails = await createUploadsDetails(file.name);
      // Upload file lên server sử dụng presigned URL
      const response = await fetch(uploadDetails.uploadUrl, {
        method: "PUT",
        body: file,
      });
      if (response.ok) {
        // Sau khi upload thành công; dispatch event để thêm video vào timeline
        dispatch(ADD_VIDEO, {
          payload: {
            details: { src: uploadDetails.url },
            preview: uploadDetails.url, // hoặc xử lý tạo thumbnail ở đây
          },
        });
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
    // Reset input
    e.target.value = "";
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Tải lên
      </div>
      <input
        onChange={onInputFileChange}
        ref={inputFileRef}
        type="file"
        className="hidden"
        accept="image/*,audio/*,video/*"
      />
      <div className="px-0 py-0">
        {/* Component trang trí AddOption được tích hợp */}
        {/* <AddOption /> */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsContent value="projects">
            <FormUpload />  
            <div className="relative">
              <OptionUpload />
              <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg backdrop-filter rounded-lg shadow-lg p-4">
                <div className="flex justify-end gap-2">
                  <ButtonEffect
                    type="cancel"
                    onClick={() => {
                      // Xử lý huỷ
                    }}
                    disabled={isUploading}
                  />
                  <ButtonEffect
                    type="upload"
                    onClick={() => {
                      inputFileRef.current?.click();
                    }}
                    disabled={isUploading}
                  />
                </div>
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