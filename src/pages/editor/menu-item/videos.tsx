import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { IVideo } from "@designcombo/types";
import { VideoIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import useAuthStore from "@/store/use-auth-store";
import useVideoStore from "@/store/use-video-store";
import useLayoutStore from "../store/use-layout-store";

interface VideoItem {
  video_id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  thumbnail: string;
}

const SCROLL_TO_VIDEO = 'SCROLL_TO_VIDEO';

const defaultVideoDetails = {
  width: 1920,
  height: 1080,
  opacity: 100,
  volume: 100,
  borderRadius: 0,
  borderWidth: 0,
  borderColor: "#000000",
  boxShadow: {
    color: "#000000",
    x: 0,
    y: 0,
    blur: 0,
  },
  top: "0px",
  left: "0px",
  transform: "none",
  blur: 0,
  brightness: 100,
  flipX: false,
  flipY: false,
  rotate: "0deg",
  visibility: "visible" as const,
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return date.toLocaleString('vi-VN', options);
};

export const Videos = () => {  
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  const { accessToken } = useAuthStore();
  const { setSelectedVideoId } = useVideoStore();
  const { setShowMenuItem, setActiveMenuItem } = useLayoutStore();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // Kiểm tra xem có token không
        if (!accessToken) {
          console.log('Không có token xác thực, không thể tải danh sách video');
          setError('Vui lòng đăng nhập để xem danh sách video');
          setLoading(false);
          return;
        }
        
        console.log('Đang gọi API với token:', accessToken ? 'Đã tìm thấy token' : 'Không có token');
        
        const response = await fetch('http://localhost:8000/api/v1/videos/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Token không hợp lệ hoặc đã hết hạn');
            setError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            // Có thể thêm logic để đăng xuất người dùng ở đây
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data && data.videos && Array.isArray(data.videos)) {
          setVideos(data.videos);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [accessToken]); // Thêm accessToken vào dependency array để fetch lại khi token thay đổi

  const handleAddVideo = (video: VideoItem) => {
    // Save the selected video ID to the store and localStorage
    setSelectedVideoId(video.video_id);
    console.log("Selected video ID:", video.video_id);
    
    const payload: Partial<IVideo> = {
      type: "video",
      details: {
        ...defaultVideoDetails,
        src: video.file_url,
      },
      name: video.file_name,
      id: generateId(),
    };

    dispatch(ADD_VIDEO, {
      payload,
      options: {
        resourceId: "main",
        scaleMode: "fit",
      },
    });

    dispatch(SCROLL_TO_VIDEO, {
      payload: {
        id: payload.id,
      },
    });
    
    // Đóng menu videos sau khi chọn video
    setShowMenuItem(false);
    setActiveMenuItem(null);
    
    console.log("Đã đóng menu videos sau khi chọn video:", video.file_name);
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
          Videos
        </div>
        <div className="flex h-32 items-center justify-center text-zinc-400">
          Loading videos...
        </div>
      </div>
    );
  }

  if (error) {
    // Kiểm tra nếu lỗi liên quan đến đăng nhập
    const isAuthError = error.includes("đăng nhập") || 
                        error.includes("Phiên") || 
                        error.includes("401") ||
                        error.includes("Unauthorized");
    
    return (
      <div className="flex flex-1 flex-col">
        <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
          Videos
        </div>
        <div className="flex flex-col h-32 items-center justify-center gap-2">
          <div className="text-red-400">
            {error}
          </div>
          
          {isAuthError && (
            <button 
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              onClick={() => window.location.href = '/auth'}
            >
              Đăng nhập lại
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Videos
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {videos.map((video) => (
            <VideoItem
              key={video.video_id}
              video={video}
              shouldDisplayPreview={!isDraggingOverTimeline}
              onAddVideo={handleAddVideo}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface VideoItemProps {
  video: VideoItem;
  shouldDisplayPreview: boolean;
  onAddVideo: (video: VideoItem) => void;
}

const VideoItem = ({ video, shouldDisplayPreview, onAddVideo }: VideoItemProps) => {
  const thumbnailStyle = {
    backgroundImage: `url(${video.thumbnail || 'https://placehold.co/300x200/333/FFF?text=Video'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '80px',
    height: '60px',
  };

  const draggableData = {
    type: "video" as const,
    details: {
      ...defaultVideoDetails,
      src: video.file_url,
    },
    name: video.file_name,
  };

  return (
    <Draggable
      data={draggableData}
      renderCustomPreview={<div style={thumbnailStyle} />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div
        draggable={false}
        onClick={() => onAddVideo(video)}
        className="group flex items-center gap-4 cursor-pointer p-2 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="relative flex-shrink-0">
          <div style={thumbnailStyle} className="rounded" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
            <VideoIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity" width={20} height={20} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate max-w-[200px]">
            {video.file_name}
          </div>
          <div className="text-xs text-zinc-400">
            {formatDate(video.created_at)}
          </div>
        </div>
      </div>
    </Draggable>
  );
};
