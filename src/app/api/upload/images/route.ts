import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { isCloudinaryConfigured, uploadImageFromBuffer } from "@/lib/cloudinary";
import { MAX_IMAGES_PER_REQUEST, parseImageFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await req.formData();
    const fileEntries = formData.getAll("files");
    const fileArrayEntries = formData.getAll("files[]");
    const entries = fileEntries.length
      ? fileEntries
      : fileArrayEntries.length
      ? fileArrayEntries
      : formData.getAll("file");

    if (entries.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    if (entries.length > MAX_IMAGES_PER_REQUEST) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_IMAGES_PER_REQUEST} images at once.` },
        { status: 400 },
      );
    }

    const images = [];

    for (const entry of entries) {
      const parsed = await parseImageFile(entry);
      if ("error" in parsed) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }

      const uploaded = await uploadImageFromBuffer(parsed.buffer, parsed.name);
      images.push(uploaded);
    }

    return NextResponse.json({ images, count: images.length });
  } catch (error) {
    console.error("[upload/images]", error);
    return NextResponse.json({ error: "Unable to upload images." }, { status: 500 });
  }
}
