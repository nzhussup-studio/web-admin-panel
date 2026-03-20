import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

jest.mock("keycloak-js", () =>
  jest.fn().mockImplementation(() => ({
    authenticated: false,
    token: undefined,
    tokenParsed: undefined,
    onAuthSuccess: undefined,
    onAuthError: undefined,
    onAuthRefreshSuccess: undefined,
    onAuthRefreshError: undefined,
    onAuthLogout: undefined,
    onTokenExpired: undefined,
    init: jest.fn().mockResolvedValue(false),
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    updateToken: jest.fn().mockResolvedValue(true),
    clearToken: jest.fn(),
  }))
);

jest.mock("html2pdf.js", () => {
  const chain = {
    set: jest.fn(() => chain),
    from: jest.fn(() => chain),
    save: jest.fn(() => Promise.resolve()),
  };

  return jest.fn(() => chain);
});

const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  } as Response)
);

global.fetch = mockFetch as unknown as typeof fetch;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

const storedValues = new Map<string, string>();

const localStorageMock: Storage = {
  get length() {
    return storedValues.size;
  },
  clear: () => storedValues.clear(),
  getItem: (key: string) => storedValues.get(key) ?? null,
  key: (index: number) => Array.from(storedValues.keys())[index] ?? null,
  removeItem: (key: string) => storedValues.delete(key),
  setItem: (key: string, value: string) => storedValues.set(key, value),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

beforeEach(() => {
  storedValues.clear();
  storedValues.set("isDarkMode", "false");
  mockFetch.mockClear();
});
