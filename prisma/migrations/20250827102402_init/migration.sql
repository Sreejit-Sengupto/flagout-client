/*
  Warnings:

  - You are about to drop the column `clerkUserId` on the `FeatureFlags` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerk_user_id]` on the table `FeatureFlags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerk_user_id` to the `FeatureFlags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `FeatureFlags` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TargetUser" AS ENUM ('ALL', 'BETA', 'INTERNAL', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."Environment" AS ENUM ('PRODUCTION', 'DEVELOPMENT', 'STAGING');

-- DropIndex
DROP INDEX "public"."FeatureFlags_clerkUserId_key";

-- AlterTable
ALTER TABLE "public"."FeatureFlags" DROP COLUMN "clerkUserId",
ADD COLUMN     "clerk_user_id" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "environment" "public"."Environment" NOT NULL DEFAULT 'DEVELOPMENT',
ADD COLUMN     "rollout_percentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "targeting" "public"."TargetUser" NOT NULL DEFAULT 'ALL';

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlags_clerk_user_id_key" ON "public"."FeatureFlags"("clerk_user_id");
