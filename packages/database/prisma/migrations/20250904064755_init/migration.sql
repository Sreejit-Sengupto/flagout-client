-- CreateTable
CREATE TABLE "public"."FlagEnviroment" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "prod" TEXT,
    "dev" TEXT,
    "stage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlagEnviroment_pkey" PRIMARY KEY ("id")
);
