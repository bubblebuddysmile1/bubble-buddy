"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type CategoryImageUploadProps = {
  currentImage: string | null;
  onImageUrlChange: (url: string) => void;
};

type UploadedImage = {
  url: string;
  publicId: string;
};

export default function CategoryImageUpload({
  currentImage,
  onImageUrlChange,
}: CategoryImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentImage ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      const uploaded = data.image as UploadedImage;
      setPreview(uploaded.url);
      onImageUrlChange(uploaded.url);
      setSuccess("Image uploaded successfully.");
    } catch {
      setError("Unable to upload image. Check Cloudinary configuration.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview("");
    onImageUrlChange("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileSelect}
        />

        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="sm"
          className="rounded-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <ImagePlus className="size-4" />
              Upload image
            </>
          )}
        </Button>

        {preview && (
          <Button
            type="button"
            onClick={handleRemove}
            size="sm"
            variant="destructive"
            className="rounded-full"
          >
            <X className="size-4" />
            Remove
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-700">{success}</p>}

      {preview && (
        <div className="overflow-hidden rounded-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Category preview"
            className="h-32 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
