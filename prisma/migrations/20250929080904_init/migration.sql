-- DropForeignKey
ALTER TABLE "public"."AISum" DROP CONSTRAINT "AISum_flag_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."FlagEvaluationLogs" DROP CONSTRAINT "FlagEvaluationLogs_flag_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."FlagEvaluationLogs" ADD CONSTRAINT "FlagEvaluationLogs_flag_id_fkey" FOREIGN KEY ("flag_id") REFERENCES "public"."FeatureFlags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AISum" ADD CONSTRAINT "AISum_flag_id_fkey" FOREIGN KEY ("flag_id") REFERENCES "public"."FeatureFlags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
