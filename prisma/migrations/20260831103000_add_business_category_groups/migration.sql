ALTER TABLE "business_category"
ADD COLUMN "groupName" TEXT,
ADD COLUMN "groupOrder" INTEGER NOT NULL DEFAULT 0;

DROP INDEX "business_category_isActive_sortOrder_name_idx";

CREATE INDEX "business_category_isActive_groupOrder_sortOrder_name_idx"
ON "business_category"("isActive", "groupOrder", "sortOrder", "name");
