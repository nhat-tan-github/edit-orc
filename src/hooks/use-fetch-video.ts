import { useState, useEffect } from 'react';
import useAuthStore from '@/store/use-auth-store';

interface VideoData {
  video_id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  thumbnail: string;
}

interface UseFetchVideoResult {
  videoData: VideoData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch video data from the API
 * @param videoId The ID of the video to fetch
 * @returns An object containing the video data, loading state, and error state
 */
export const useFetchVideo = (videoId: string | null): UseFetchVideoResult => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    // Reset states when videoId changes
    setVideoData(null);
    setError(null);
    
    const fetchVideoData = async () => {
      if (!videoId || !accessToken) {
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Creating video URL for ID: ${videoId}`);
        
        // Tạo URL trực tiếp đến file video với token xác thực
        const videoUrl = `http://localhost:8000/api/v1/videos/${videoId}`;
        
        // Kiểm tra xem video có tồn tại không bằng cách gửi HEAD request
        const checkResponse = await fetch(videoUrl, {
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!checkResponse.ok) {
          if (checkResponse.status === 401) {
            throw new Error('Unauthorized: Please log in again');
          }
          throw new Error(`Video not found: status ${checkResponse.status}`);
        }
        
        // Lấy thông tin từ danh sách videos
        const listResponse = await fetch('http://localhost:8000/api/v1/videos/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!listResponse.ok) {
          throw new Error(`Failed to fetch video list: ${listResponse.status}`);
        }
        
        const listData = await listResponse.json();
        console.log('Video list response:', listData);
        
        if (!listData || !listData.videos || !Array.isArray(listData.videos)) {
          throw new Error('Invalid video list format');
        }
        
        // Tìm video trong danh sách
        const videoInfo = listData.videos.find((v: any) => v.video_id === videoId);
        
        if (!videoInfo) {
          throw new Error(`Video with ID ${videoId} not found in list`);
        }
        
        // Cập nhật dữ liệu video với URL trực tiếp
        setVideoData({
          ...videoInfo,
          file_url: videoUrl
        });
        
      } catch (error) {
        console.error('Error fetching video data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch video data');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId, accessToken]);

  return { videoData, loading, error };
};