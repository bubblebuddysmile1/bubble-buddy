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
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const markImageAsFailed = (url: string) => {
    setFailedImages((current) => (current.includes(url) ? current : [...current, url]));
  };

  const visibleImages = galleryImages.filter((image) => !failedImages.includes(image.url));
  const safeActiveImage = visibleImages[activeIndex] ?? visibleImages[0] ?? { id: "fallback", url: "/category/1.jpg", alt: productName };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-4xl bg-muted">
        <Image
          key={safeActiveImage.id}
          src={safeActiveImage.url}
          alt={safeActiveImage.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          onError={() => markImageAsFailed(safeActiveImage.url)}
        />
      </div>

      {visibleImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {visibleImages.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${visibleImages.length}`}
                aria-pressed={isActive}
                className={`relative aspect-square overflow-hidden rounded-2xl bg-muted ring-2 transition ${
                  isActive ? "ring-primary" : "ring-transparent hover:ring-border"
                }`}
              >
                <Image
                  src={image.url}
                  
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 25vw, 12vw"
                  className="object-cover"
                  onError={() => markImageAsFailed(image.url)}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
