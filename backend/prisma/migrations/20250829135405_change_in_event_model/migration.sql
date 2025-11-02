-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT;
