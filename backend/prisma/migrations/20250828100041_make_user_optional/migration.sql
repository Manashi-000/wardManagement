-- DropForeignKey
ALTER TABLE "public"."Complaint" DROP CONSTRAINT "Complaint_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Complaint" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
