/*
  Warnings:

  - Added the required column `description` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishedAt` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "establishedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;
