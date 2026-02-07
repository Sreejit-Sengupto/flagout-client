-- AlterTable
ALTER TABLE "public"."FeatureFlags" ADD COLUMN     "projectId" TEXT;

-- CreateTable
CREATE TABLE "public"."Projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FeatureFlags" ADD CONSTRAINT "FeatureFlags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
