import Keycloak from "keycloak-js";

const keycloakUrl =
  typeof __APP_KEYCLOAK_URL__ === "string" && __APP_KEYCLOAK_URL__.trim()
    ? __APP_KEYCLOAK_URL__
    : "http://localhost:8081";
const keycloakRealm =
  typeof __APP_KEYCLOAK_REALM__ === "string" && __APP_KEYCLOAK_REALM__.trim()
    ? __APP_KEYCLOAK_REALM__
    : "backend-auth-dev";
const keycloakClientId =
  typeof __APP_KEYCLOAK_CLIENT_ID__ === "string" &&
  __APP_KEYCLOAK_CLIENT_ID__.trim()
    ? __APP_KEYCLOAK_CLIENT_ID__
    : "frontend-admin-auth-client";

export const keycloakAccountUrl = `${keycloakUrl}/realms/${keycloakRealm}/account`;

const keycloak = new Keycloak({
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: keycloakClientId,
});

export default keycloak;
