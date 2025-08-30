-- CreateTable
CREATE TABLE "public"."RecentActivity" (
    "id" TEXT NOT NULL,
    "flag_id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RecentActivity" ADD CONSTRAINT "RecentActivity_flag_id_fkey" FOREIGN KEY ("flag_id") REFERENCES "public"."FeatureFlags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
