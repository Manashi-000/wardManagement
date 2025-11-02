/*
  Warnings:

  - Added the required column `createAt` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `policyDescription` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Policy" ADD COLUMN     "createAt" TEXT NOT NULL,
ADD COLUMN     "policyDescription" TEXT NOT NULL;
