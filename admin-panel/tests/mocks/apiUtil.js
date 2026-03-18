jest.mock("@/lib/api/client", () => ({
  CacheService: {
    deleteV1AlbumCache: jest.fn(() => Promise.resolve()),
  },
}));
