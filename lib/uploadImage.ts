// Browser-side helpers for admin image uploads (lesson screenshots and
// course pictures). The server half is app/api/admin/uploads/route.ts.

// Screenshots and photos are often 2-5 MB. Anything big is scaled to at
// most `maxWidth` pixels wide and saved as WebP before uploading, so
// pages load fast.
export async function shrinkImage(file: File, maxWidth = 1800): Promise<File> {
  if (file.type === "image/gif" || file.size < 800 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85)
    );

    return blob && blob.size < file.size
      ? new File([blob], "image.webp", { type: "image/webp" })
      : file;
  } catch {
    return file;
  }
}

/**
 * Shrinks and uploads one image, returning its public URL. Throws an
 * Error with a readable message if the upload is refused.
 */
export async function uploadAdminImage(
  file: File,
  folder: "lessons" | "courses" = "lessons"
): Promise<string> {
  const body = new FormData();
  body.append("file", await shrinkImage(file));
  body.append("folder", folder);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed.");
  }

  return data.url as string;
}
