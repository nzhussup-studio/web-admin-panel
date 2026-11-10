export type ImagePreview = {
  file: File;
  preview: string;
};

export const isHeic = (file: File) =>
  /^image\/hei[cf](?:-sequence)?$/i.test(file.type) ||
  /\.hei[cf]$/i.test(file.name);

const withHeicContentType = (file: File) =>
  file.type === "image/heic"
    ? file
    : new File([file], file.name, {
        type: "image/heic",
        lastModified: file.lastModified,
      });

const readAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Unable to read image"));
    reader.readAsDataURL(blob);
  });

export async function createImagePreview(file: File): Promise<ImagePreview> {
  if (!isHeic(file)) {
    return { file, preview: await readAsDataUrl(file) };
  }

  // Load the HEIC decoder only when it is needed. The converted JPEG is used
  // solely for the browser thumbnail; the original HEIC bytes are uploaded.
  const { heicTo } = await import("heic-to/csp");
  const previewBlob = await heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.8,
  });
  return {
    file: withHeicContentType(file),
    preview: await readAsDataUrl(previewBlob),
  };
}
