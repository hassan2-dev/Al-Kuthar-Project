-- AlterTable
ALTER TABLE "Contract"
ADD COLUMN "details" JSONB,
ADD COLUMN "contractDate" TIMESTAMP(3),
ADD COLUMN "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "archivedAt" TIMESTAMP(3),
ADD COLUMN "createdById" TEXT,
ADD COLUMN "confirmedById" TEXT;
