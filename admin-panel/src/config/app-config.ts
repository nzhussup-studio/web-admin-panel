const fallbackApiBase = "http://localhost:8082";
const fallbackKeycloakUrl = "http://localhost:8081";
const fallbackKeycloakRealm = "backend-auth-dev";
const fallbackKeycloakClientId = "frontend-admin-auth-client";

const config = {
  apiBase:
    typeof __APP_API_BASE__ === "string" && __APP_API_BASE__.trim().length > 0
      ? __APP_API_BASE__
      : fallbackApiBase,
  keycloakUrl:
    typeof __APP_KEYCLOAK_URL__ === "string" &&
    __APP_KEYCLOAK_URL__.trim().length > 0
      ? __APP_KEYCLOAK_URL__
      : fallbackKeycloakUrl,
  keycloakRealm:
    typeof __APP_KEYCLOAK_REALM__ === "string" &&
    __APP_KEYCLOAK_REALM__.trim().length > 0
      ? __APP_KEYCLOAK_REALM__
      : fallbackKeycloakRealm,
  keycloakClientId:
    typeof __APP_KEYCLOAK_CLIENT_ID__ === "string" &&
    __APP_KEYCLOAK_CLIENT_ID__.trim().length > 0
      ? __APP_KEYCLOAK_CLIENT_ID__
      : fallbackKeycloakClientId,
  showNoInfoDelay: 500,
  cvGeneratorLocalStorageKey: "cvGeneratorSelectedItems",
};

export default config;
