import { useQuery } from "@tanstack/react-query";
import { AlbumService, queryKeys } from "@/api";

export const useAlbum = (id?: string) => {
  const query = useQuery({
    queryKey: queryKeys.albums.detail(id ?? "missing"),
    queryFn: async () =>
      (await AlbumService.getV1Album1(id as string)).data ?? null,
    enabled: Boolean(id),
  });

  return {
    album: query.data ?? null,
    loading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
};

export const listAlbums = async () =>
  (await AlbumService.getV1Album("all")).data ?? [];

export const getAlbum = async (id: string) =>
  (await AlbumService.getV1Album1(id)).data ?? null;
