-- CreateTable
CREATE TABLE "public"."AISum" (
    "id" TEXT NOT NULL,
    "flag_id" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "recommendation" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AISum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AISum_flag_id_key" ON "public"."AISum"("flag_id");

-- AddForeignKey
ALTER TABLE "public"."AISum" ADD CONSTRAINT "AISum_flag_id_fkey" FOREIGN KEY ("flag_id") REFERENCES "public"."FeatureFlags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
