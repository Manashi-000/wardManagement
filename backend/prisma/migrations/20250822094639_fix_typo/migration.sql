/*
  Warnings:

  - Made the column `organizationId` on table `Budget` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Budget" DROP CONSTRAINT "Budget_organizationId_fkey";

-- AlterTable
ALTER TABLE "public"."Budget" ALTER COLUMN "organizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
