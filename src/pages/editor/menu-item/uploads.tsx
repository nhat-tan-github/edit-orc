import React, { useRef, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createUploadsDetails } from "@/utils/upload"; // hàm tạo presigned URL
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO } from "@designcombo/state";
import {FormUpload} from "./form-upload";
import { OptionUpload } from "./upload-option";
import { ButtonEffect } from "@/components/ButtonEffect";
import { ActionButton } from "@/components/ActionButton";
export const Uploads = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAction = (action: string) => {
    if (action === "cancel") {
      setSelectedFile(null);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const uploadDetails = await createUploadsDetails(selectedFile.name);
      const response = await fetch(uploadDetails.uploadUrl, {
        method: "PUT",
        body: selectedFile,
      });
      if (response.ok) {
        dispatch(ADD_VIDEO, {
          payload: {
            details: { src: uploadDetails.url },
            preview: uploadDetails.url,
          },
        });
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (inputFileRef.current) inputFileRef.current.value = "";
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
        {/* Component trang trí AddOption được tích hợp */}
        {/* <AddOption /> */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsContent value="projects">
            <FormUpload />  
            <div className="relative">
              <OptionUpload />
              <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg backdrop-filter rounded-lg shadow-lg p-4">
                <div className="flex justify-end gap-2">
                  <ActionButton
                    label="Hủy"
                    onClick={() => handleAction("cancel")}
                    variant="red"
                  />
                  <ActionButton
                    label="Xác nhận"
                    onClick={handleConfirm}
                    variant="blue"
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