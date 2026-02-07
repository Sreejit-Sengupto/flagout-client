/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `FeatureFlags` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `FeatureFlags` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."FeatureFlags" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlags_slug_key" ON "public"."FeatureFlags"("slug");
