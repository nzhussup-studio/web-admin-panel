import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase =
    process.env.VITE_API_BASE || env.VITE_API_BASE || "http://localhost:8082";
  const keycloakUrl =
    process.env.VITE_KEYCLOAK_URL ||
    env.VITE_KEYCLOAK_URL ||
    "http://localhost:8081";
  const keycloakRealm =
    process.env.VITE_KEYCLOAK_REALM ||
    env.VITE_KEYCLOAK_REALM ||
    "backend-auth-dev";
  const keycloakClientId =
    process.env.VITE_KEYCLOAK_CLIENT_ID ||
    env.VITE_KEYCLOAK_CLIENT_ID ||
    "frontend-admin-auth-client";

  return {
    plugins: [react()],
    define: {
      __APP_API_BASE__: JSON.stringify(apiBase),
      __APP_KEYCLOAK_URL__: JSON.stringify(keycloakUrl),
      __APP_KEYCLOAK_REALM__: JSON.stringify(keycloakRealm),
      __APP_KEYCLOAK_CLIENT_ID__: JSON.stringify(keycloakClientId),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
    },
  };
});
