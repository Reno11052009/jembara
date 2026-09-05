-- Existing student profiles remain private until the owner explicitly opts in.
ALTER TABLE "student"
ADD COLUMN "isPublicProfile" BOOLEAN NOT NULL DEFAULT false;

-- Cancelled signed-upload reservations remain recorded until expiry so a
-- still-valid upload token cannot be finalized and its object can be cleaned.
ALTER TABLE "message_attachment_upload"
ADD COLUMN "cancelledAt" TIMESTAMP(6);
