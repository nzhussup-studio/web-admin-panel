import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useAlbum } from "@/hooks/albums/useAlbum";
import { AlbumService } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  AlbumService: { getV1Album1: jest.fn() },
}));

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function QueryWrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
};

describe("useAlbum", () => {
  it("exposes album server state through TanStack Query", async () => {
    jest.mocked(AlbumService.getV1Album1).mockResolvedValue({
      data: { id: "summer", title: "Summer", images: [] },
    } as never);

    const { result } = renderHook(() => useAlbum("summer"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.album?.title).toBe("Summer");
    expect(AlbumService.getV1Album1).toHaveBeenCalledWith("summer");
  });
});
