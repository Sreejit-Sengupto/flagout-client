/*
  Warnings:

  - Made the column `projectId` on table `FeatureFlags` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."FeatureFlags" DROP CONSTRAINT "FeatureFlags_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."FeatureFlags" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."FeatureFlags" ADD CONSTRAINT "FeatureFlags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
