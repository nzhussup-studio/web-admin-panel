import config from "@/config/app-config";

export const getAlbumImageUrl = (imageUrl?: string) =>
  `${config.apiBase}${imageUrl || ""}`;
