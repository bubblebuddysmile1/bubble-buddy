export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES_PER_REQUEST = 10;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type ParsedImageFile = {
  buffer: Buffer;
  name?: string;
  mimeType: string;
  size: number;
};

export function validateImageFile(file: FormDataEntryValue | null) {
  if (!file || typeof file === "string") {
    return { error: "No file provided." as const };
  }

  if (!(file instanceof Blob)) {
    return { error: "Invalid file." as const };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only JPEG, PNG, WebP, and GIF images are allowed." as const };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: "Each image must be 5MB or smaller." as const };
  }

  return null;
}

export async function parseImageFile(
  file: FormDataEntryValue | null,
): Promise<ParsedImageFile | { error: string }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return validationError;
  }

  const blob = file as Blob;
  const buffer = Buffer.from(await blob.arrayBuffer());
  const name = "name" in blob && typeof blob.name === "string" ? blob.name : undefined;

  return {
    buffer,
    name,
    mimeType: blob.type,
    size: blob.size,
  };
}
