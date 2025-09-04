/*
  Warnings:

  - A unique constraint covering the columns `[clerk_user_id]` on the table `FlagEnviroment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FlagEnviroment_clerk_user_id_key" ON "public"."FlagEnviroment"("clerk_user_id");
