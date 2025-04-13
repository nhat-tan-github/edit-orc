import { create } from "zustand";

interface VideoStore {
  selectedVideoId: string | null;
  isVideoMenuOpen: boolean;
  setSelectedVideoId: (videoId: string) => void;
  clearSelectedVideoId: () => void;
  openVideoMenu: () => void;
  closeVideoMenu: () => void;
  toggleVideoMenu: () => void;
}

const useVideoStore = create<VideoStore>((set) => ({
  selectedVideoId: localStorage.getItem('selectedVideoId'),
  isVideoMenuOpen: false,
  
  setSelectedVideoId: (videoId: string) => {
    localStorage.setItem('selectedVideoId', videoId);
    localStorage.setItem('mostRecentVideoId', videoId); // For compatibility with existing code
    set({ selectedVideoId: videoId });
  },
  
  clearSelectedVideoId: () => {
    localStorage.removeItem('selectedVideoId');
    set({ selectedVideoId: null });
  },
  
  openVideoMenu: () => set({ isVideoMenuOpen: true }),
  closeVideoMenu: () => set({ isVideoMenuOpen: false }),
  toggleVideoMenu: () => set((state) => ({ isVideoMenuOpen: !state.isVideoMenuOpen })),
}));

export default useVideoStore;