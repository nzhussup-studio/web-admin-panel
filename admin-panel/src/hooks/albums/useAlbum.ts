import { useCallback, useEffect, useState } from "react";
import { AlbumService, type image_service_model_Album } from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";

export const useAlbum = (id?: string) => {
  const [album, setAlbum] = useState<image_service_model_Album | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchAlbum = useCallback(async () => {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await AlbumService.getV1Album1(id);
      setAlbum(response.data || null);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchAlbum();
  }, [fetchAlbum]);

  return {
    album,
    loading,
    error,
    refetch: fetchAlbum,
  };
};
