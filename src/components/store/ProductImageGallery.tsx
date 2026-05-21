"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
};

type ProductImageGalleryProps = {
  productName: string;
  thumbnail?: string | null;
  images: { id: number; url: string; altText?: string | null }[];
};

export default function ProductImageGallery({
  productName,
  thumbnail,
  images,
}: ProductImageGalleryProps) {
  const galleryImages = useMemo(() => {
    const items: GalleryImage[] = [];
    const seen = new Set<string>();

    const addImage = (id: string, url: string, alt: string) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      items.push({ id, url, alt });
    };

    if (thumbnail) {
      addImage("thumbnail", thumbnail, productName);
    }

    for (const image of images) {
      addImage(String(image.id), image.url, image.altText ?? productName);
    }

    if (items.length === 0) {
      addImage("fallback", "/category/1.jpg", productName);
    }

    return items;
  }, [images, productName, thumbnail]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-muted">
        <Image
          key={activeImage.id}
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          priority
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {galleryImages.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${galleryImages.length}`}
                aria-pressed={isActive}
                className={`relative aspect-square overflow-hidden rounded-2xl bg-muted ring-2 transition ${
                  isActive ? "ring-primary" : "ring-transparent hover:ring-border"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
