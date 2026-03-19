import { OpenAPI } from "@/gen/api";
import config from "@/config/app-config";
import keycloak from "@/lib/auth/keycloak";

OpenAPI.BASE = config.apiBase;
OpenAPI.TOKEN = async () => {
  if (!keycloak.authenticated) {
    return "";
  }

  try {
    await keycloak.updateToken(30);
  } catch {
    return "";
  }

  return keycloak.token ?? "";
};

export { ApiError } from "@/gen/api";
export * from "@/gen/api";
