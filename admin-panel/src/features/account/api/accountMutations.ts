import { AccountService, CacheControllerService, CacheService } from "@/api";

export const clearAccountCaches = () =>
  Promise.all([
    CacheControllerService.createAdminCache(),
    CacheService.deleteV1AdminAlbumsCache(),
  ]);
export const deleteAccount = () => AccountService.deleteV1MeAccount();
