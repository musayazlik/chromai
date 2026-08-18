-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "coverUrl" TEXT,
    "coverAlt" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "readMinutes" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_locale_publishedAt_idx" ON "BlogPost"("locale", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_locale_key" ON "BlogPost"("slug", "locale");
