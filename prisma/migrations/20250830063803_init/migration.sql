/*
  Warnings:

  - Added the required column `clerk_user_id` to the `RecentActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RecentActivity" ADD COLUMN     "clerk_user_id" TEXT NOT NULL;
