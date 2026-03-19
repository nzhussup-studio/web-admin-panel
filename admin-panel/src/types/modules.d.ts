declare module "html2pdf.js";

declare global {
  const __APP_API_BASE__: string | undefined;
  const __APP_KEYCLOAK_URL__: string | undefined;
  const __APP_KEYCLOAK_REALM__: string | undefined;
  const __APP_KEYCLOAK_CLIENT_ID__: string | undefined;
}

export {};
