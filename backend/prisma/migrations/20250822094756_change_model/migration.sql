/*
  Warnings:

  - Made the column `userId` on table `Complaint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Policy` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Complaint" DROP CONSTRAINT "Complaint_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Policy" DROP CONSTRAINT "Policy_organizationId_fkey";

-- AlterTable
ALTER TABLE "public"."Complaint" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Policy" ALTER COLUMN "organizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Policy" ADD CONSTRAINT "Policy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
