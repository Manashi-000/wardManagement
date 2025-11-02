-- CreateTable
CREATE TABLE "public"."Emergency" (
    "id" TEXT NOT NULL,
    "public_service" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Emergency_pkey" PRIMARY KEY ("id")
);
