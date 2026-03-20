import { renderHook, waitFor } from "@testing-library/react";
import { useAlbum } from "@/hooks/albums/useAlbum";
import { AlbumService } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  AlbumService: {
    getV1Album1: jest.fn(),
  },
}));

const mockGetAlbum = AlbumService.getV1Album1 as jest.Mock;

describe("hooks/albums/useAlbum.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads album data for a given id", async () => {
    mockGetAlbum.mockResolvedValue({
      data: {
        id: "album-1",
        title: "Public Album",
        type: "public",
        images: [],
      },
    });

    const { result } = renderHook(() => useAlbum("album-1"));

    await waitFor(() =>
      expect(result.current.album).toEqual(
        expect.objectContaining({ id: "album-1", title: "Public Album" }),
      ),
    );
    expect(mockGetAlbum).toHaveBeenCalledWith("album-1");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("captures normalized errors when loading fails", async () => {
    mockGetAlbum.mockRejectedValue({ status: 403, body: { message: "Forbidden" } });

    const { result } = renderHook(() => useAlbum("album-1"));

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.album).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
