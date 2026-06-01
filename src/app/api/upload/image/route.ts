import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { isCloudinaryConfigured, uploadImageFromBuffer } from "@/lib/cloudinary";
import { parseImageFile } from "@/lib/upload";

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
    const fileEntry =
      formData.get("file") ?? formData.get("image") ?? formData.get("files") ?? formData.get("files[]");
    const parsed = await parseImageFile(fileEntry);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const uploaded = await uploadImageFromBuffer(parsed.buffer, parsed.name);

    return NextResponse.json({ image: uploaded });
  } catch (error) {
    console.error("[upload/image]", error);
    return NextResponse.json({ error: "Unable to upload image." }, { status: 500 });
  }
}
