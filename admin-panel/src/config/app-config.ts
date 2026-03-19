const fallbackApiBase = "http://localhost:8082";

const config = {
  apiBase:
    typeof __APP_API_BASE__ === "string" && __APP_API_BASE__.trim().length > 0
      ? __APP_API_BASE__
      : fallbackApiBase,
  showNoInfoDelay: 500,
  cvGeneratorLocalStorageKey: "cvGeneratorSelectedItems",
};

export default config;
