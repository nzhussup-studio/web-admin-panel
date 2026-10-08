import { OpenAPI } from "./generated";
import keycloak from "@/providers/auth/keycloak";

export const API_BASE =
  typeof __APP_API_BASE__ === "string" && __APP_API_BASE__.trim().length > 0
    ? __APP_API_BASE__
    : "http://localhost:8082";

OpenAPI.BASE = API_BASE;
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

export { ApiError } from "./generated";
export * from "./generated";
