/*
  Warnings:

  - Added the required column `hash` to the `AISum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AISum" ADD COLUMN     "hash" TEXT NOT NULL;
