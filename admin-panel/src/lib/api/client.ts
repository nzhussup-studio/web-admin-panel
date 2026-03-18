import { OpenAPI } from "@/gen/api";
import config from "@/config/app-config";

OpenAPI.BASE = config.apiBase;
OpenAPI.TOKEN = async () => localStorage.getItem("token") ?? "";

export { ApiError } from "@/gen/api";
export * from "@/gen/api";
