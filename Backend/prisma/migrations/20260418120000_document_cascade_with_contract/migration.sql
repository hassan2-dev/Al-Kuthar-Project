-- Document rows follow the contract row: deleting a contract removes linked documents in the DB.
ALTER TABLE "Document" DROP CONSTRAINT "Document_contractId_fkey";

ALTER TABLE "Document"
ADD CONSTRAINT "Document_contractId_fkey"
FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
