-- AlterTable
ALTER TABLE "Contract" ADD COLUMN "contractNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractNumber_key" ON "Contract"("contractNumber");

-- CreateTable
CREATE TABLE "ContractNumberCounter" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ContractNumberCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContractNumberCounter_category_year_key" ON "ContractNumberCounter"("category", "year");
