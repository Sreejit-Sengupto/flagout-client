-- CreateEnum
CREATE TYPE "public"."TargetUser" AS ENUM ('ALL', 'BETA', 'INTERNAL', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."Environment" AS ENUM ('PRODUCTION', 'DEVELOPMENT', 'STAGING');

-- CreateTable
CREATE TABLE "public"."FeatureFlags" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "rollout_percentage" INTEGER NOT NULL DEFAULT 0,
    "targeting" "public"."TargetUser"[] DEFAULT ARRAY['ALL']::"public"."TargetUser"[],
    "environment" "public"."Environment" NOT NULL DEFAULT 'DEVELOPMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlags_clerk_user_id_key" ON "public"."FeatureFlags"("clerk_user_id");
