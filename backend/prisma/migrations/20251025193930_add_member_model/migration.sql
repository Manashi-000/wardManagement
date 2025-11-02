-- CreateEnum
CREATE TYPE "public"."MemberType" AS ENUM ('REPRESENTATIVE', 'PUBLIC_SERVICE');

-- CreateTable
CREATE TABLE "public"."Member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "image" TEXT,
    "contactNumber" TEXT NOT NULL,
    "classification" "public"."MemberType" NOT NULL DEFAULT 'REPRESENTATIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);
