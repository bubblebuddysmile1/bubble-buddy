CREATE TABLE "BlogPost" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "heading" TEXT,
  "content" TEXT NOT NULL,
  "featuredImage" TEXT,
  "featuredImageAlt" TEXT,
  "faq" TEXT,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "metaKeywords" TEXT,
  "relatedSlugs" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
