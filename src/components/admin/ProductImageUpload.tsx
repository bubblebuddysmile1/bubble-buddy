"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type GalleryImage = {
  id?: number;
  url: string;
  altText?: string | null;
  sortOrder?: number;
  publicId?: string;
};

type ProductImageUploadProps = {
  slug: string;
  productName: string;
  initialThumbnail: string | null;
  initialImages: GalleryImage[];
};

type UploadedImage = {
  url: string;
  publicId: string;
};

export default function ProductImageUpload({
  slug,
  productName,
  initialThumbnail,
  initialImages,
}: ProductImageUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnail, setThumbnail] = useState(initialThumbnail ?? "");
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList?.length) return;

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      Array.from(fileList).forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      const uploaded = (data.images ?? []) as UploadedImage[];
      const newImages: GalleryImage[] = uploaded.map((image, index) => ({
        url: image.url,
        publicId: image.publicId,
        altText: productName,
        sortOrder: images.length + index,
      }));

      setImages((prev) => [...prev, ...newImages]);

      if (!thumbnail && newImages[0]) {
        setThumbnail(newImages[0].url);
      }

      setSuccess(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded to Cloudinary.`);
    } catch {
      setError("Unable to upload images. Check Cloudinary configuration.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((image) => image.url !== url));
    if (thumbnail === url) {
      setThumbnail("");
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thumbnail: thumbnail || null,
          images: images.map((image, index) => ({
            url: image.url,
            altText: image.altText ?? productName,
            sortOrder: index,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save product images.");
        return;
      }

      setSuccess("Product images saved successfully.");
      router.refresh();
    } catch {
      setError("Unable to save product images.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
      <div>
        <h3 className="text-xl font-semibold text-foreground">Upload product images</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Images are stored on Cloudinary. Pick a thumbnail, then save to update this product.
        </p>
      </div>

      <input
        ref={fileInputRef}
        name="files"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <ImagePlus />
              Choose images
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className="rounded-full"
        >
          {isSaving ? "Saving…" : "Save to product"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-700">{success}</p>}

      {thumbnail && (
        <div className="rounded-3xl border border-border bg-background/80 p-4">
          <p className="text-sm font-semibold text-foreground">Current thumbnail</p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt={`${productName} thumbnail`} className="max-h-64 w-full object-cover" />
          </div>
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((image) => (
            <div
              key={image.url}
              className="overflow-hidden rounded-3xl border border-border bg-background/80"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.altText ?? productName} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <button
                  type="button"
                  onClick={() => setThumbnail(image.url)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    thumbnail === image.url
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <Star className="size-3.5" />
                  {thumbnail === image.url ? "Thumbnail" : "Set thumbnail"}
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(image.url)}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-border bg-background/80 p-6 text-center text-sm text-muted-foreground">
          No gallery images yet. Upload JPEG, PNG, WebP, or GIF files (max 5MB each).
        </p>
      )}
    </div>
  );
}
