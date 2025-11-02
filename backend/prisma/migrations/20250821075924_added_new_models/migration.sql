/*
  Warnings:

  - A unique constraint covering the columns `[subject,userId]` on the table `Complaint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('REGISTERED', 'INPROGRESS', 'RESOLVED');

-- AlterTable
ALTER TABLE "public"."Budget" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Complaint" ADD COLUMN     "response" TEXT,
ADD COLUMN     "status" "public"."Status" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."WardPost" (
    "id" TEXT NOT NULL,
    "postDescription" TEXT NOT NULL,
    "image" TEXT[],

    CONSTRAINT "WardPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_subject_userId_key" ON "public"."Complaint"("subject", "userId");
