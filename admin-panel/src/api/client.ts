import axios from "axios";
import { OpenAPI } from "./generated";
import keycloak from "@/providers/auth/keycloak";

export const API_BASE =
  typeof __APP_API_BASE__ === "string" && __APP_API_BASE__.trim().length > 0
    ? __APP_API_BASE__
    : "http://localhost:8082";

const getAccessToken = async () => {
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

OpenAPI.BASE = API_BASE;
OpenAPI.TOKEN = getAccessToken;

export const getAuthenticatedBlob = async (path: string): Promise<Blob> => {
  const token = await getAccessToken();
  const response = await axios.get<Blob>(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    responseType: "blob",
  });

  return response.data;
};

export { ApiError } from "./generated";
export * from "./generated";
