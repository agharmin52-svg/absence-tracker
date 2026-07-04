import { useVideoLibraryStore } from '../store/videoLibraryStore';
import { ReelTemplate } from '../types/video';

export function useVideoLibrary() {
  const videos = useVideoLibraryStore((state) => state.videos);
  const isLoading = useVideoLibraryStore((state) => state.isLoading);
  const error = useVideoLibraryStore((state) => state.error);
  const addVideo = useVideoLibraryStore((state) => state.addVideo);
  const updateVideo = useVideoLibraryStore((state) => state.updateVideo);
  const removeVideo = useVideoLibraryStore((state) => state.removeVideo);
  const getVideoById = useVideoLibraryStore((state) => state.getVideoById);
  const getVideosByTemplate = useVideoLibraryStore((state) => state.getVideosByTemplate);

  return {
    videos,
    isLoading,
    error,
    addVideo,
    updateVideo,
    removeVideo,
    getVideoById,
    getVideosByTemplate,
  };
}
