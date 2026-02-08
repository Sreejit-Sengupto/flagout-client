-- CreateTable
CREATE TABLE "public"."FlagEvaluationLogs" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "flag_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "visited_user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlagEvaluationLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlagEvaluationLogs_clerk_user_id_key" ON "public"."FlagEvaluationLogs"("clerk_user_id");

-- AddForeignKey
ALTER TABLE "public"."FlagEvaluationLogs" ADD CONSTRAINT "FlagEvaluationLogs_flag_id_fkey" FOREIGN KEY ("flag_id") REFERENCES "public"."FeatureFlags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
