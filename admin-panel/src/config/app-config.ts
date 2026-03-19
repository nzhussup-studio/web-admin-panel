const fallbackApiBase = "http://localhost:8080";
const appGlobals = globalThis as typeof globalThis & {
  __APP_API_BASE__?: string;
};

const config = {
  apiBase:
    typeof appGlobals.__APP_API_BASE__ === "string" &&
    appGlobals.__APP_API_BASE__.trim().length > 0
      ? appGlobals.__APP_API_BASE__
      : fallbackApiBase,
  showNoInfoDelay: 500,
  cvGeneratorLocalStorageKey: "cvGeneratorSelectedItems",
};

export default config;
