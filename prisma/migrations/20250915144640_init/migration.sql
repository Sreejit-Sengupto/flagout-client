-- DropForeignKey
ALTER TABLE "public"."RecentActivity" DROP CONSTRAINT "RecentActivity_flag_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."RecentActivity" ADD CONSTRAINT "RecentActivity_flag_id_fkey" FOREIGN KEY ("flag_id") REFERENCES "public"."FeatureFlags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
