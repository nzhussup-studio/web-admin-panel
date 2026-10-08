import { AccountService, CacheControllerService, CacheService } from "@/api";

export const clearAccountCaches = () =>
  Promise.all([
    CacheControllerService.createCache(),
    CacheService.deleteV1AlbumCache(),
  ]);
export const deleteAccount = () => AccountService.deleteV1Account();
