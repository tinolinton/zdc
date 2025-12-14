-- AlterTable
ALTER TABLE "Question" ADD COLUMN "orderIndex" INTEGER;

-- Backfill orderIndex based on creation order as a stable default
WITH ordered AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt", "id") AS rn
  FROM "Question"
)
UPDATE "Question" q
SET "orderIndex" = o.rn
FROM ordered o
WHERE o."id" = q."id";

-- Ensure the new column is required and unique
ALTER TABLE "Question" ALTER COLUMN "orderIndex" SET NOT NULL;

CREATE UNIQUE INDEX "Question_orderIndex_key" ON "Question"("orderIndex");
