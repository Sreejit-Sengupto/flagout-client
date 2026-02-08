-- CreateTable
CREATE TABLE "public"."APIKey" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "APIKey_key_key" ON "public"."APIKey"("key");
