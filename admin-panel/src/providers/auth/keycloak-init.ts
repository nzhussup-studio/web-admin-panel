let keycloakInitPromise: Promise<boolean> | null = null;

export const getKeycloakInitPromise = () => keycloakInitPromise;

export const setKeycloakInitPromise = (promise: Promise<boolean>) => {
  keycloakInitPromise = promise;
};

export const resetKeycloakInitPromise = () => {
  keycloakInitPromise = null;
};
