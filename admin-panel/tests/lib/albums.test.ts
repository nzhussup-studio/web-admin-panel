import { getAlbumImageUrl } from "@/lib/albums";

describe("lib/albums.ts", () => {
  test("prefixes album image urls with the API base", () => {
    expect(getAlbumImageUrl("/images/cover.jpg")).toBe(
      "http://localhost:8082/images/cover.jpg",
    );
  });

  test("returns the api base when image url is missing", () => {
    expect(getAlbumImageUrl()).toBe("http://localhost:8082");
  });
});
