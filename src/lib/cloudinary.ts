import { v2 as cloudinary } from "cloudinary";

const UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "bubble-buddy/products";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return true;
}

export type UploadedImage = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
};

export async function uploadImageFromBuffer(
  buffer: Buffer,
  filename?: string,
): Promise<UploadedImage> {
  if (!configureCloudinary()) {
    throw new Error("Cloudinary is not configured.");
  }

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
  }>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        resource_type: "image",
        use_filename: Boolean(filename),
        filename_override: filename,
        unique_filename: true,
        overwrite: false,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }
        resolve(uploadResult);
      },
    );

    upload.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

export async function deleteCloudinaryImage(publicId: string) {
  if (!configureCloudinary()) {
    throw new Error("Cloudinary is not configured.");
  }

  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
