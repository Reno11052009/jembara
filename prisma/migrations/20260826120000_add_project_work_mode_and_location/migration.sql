-- Project work arrangement is stored on the project so matching and listings
-- do not have to infer it from the UMKM owner's profile.
ALTER TABLE "project"
ADD COLUMN "workMode" TEXT NOT NULL DEFAULT 'REMOTE',
ADD COLUMN "location" TEXT;

CREATE INDEX "project_umkmId_status_createdAt_idx"
ON "project"("umkmId", "status", "createdAt");
