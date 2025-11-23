-- DropForeignKey
ALTER TABLE "public"."FeatureFlags" DROP CONSTRAINT "FeatureFlags_projectId_fkey";

-- DropIndex
DROP INDEX "public"."FeatureFlags_slug_key";

-- AddForeignKey
ALTER TABLE "public"."FeatureFlags" ADD CONSTRAINT "FeatureFlags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
