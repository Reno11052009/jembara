ALTER TABLE "message_attachment"
  DROP CONSTRAINT "message_attachment_size_valid",
  ADD CONSTRAINT "message_attachment_size_valid"
    CHECK ("sizeBytes" > 0 AND "sizeBytes" <= 536870912);

ALTER TABLE "message_attachment_upload"
  DROP CONSTRAINT "message_attachment_upload_size_valid",
  ADD CONSTRAINT "message_attachment_upload_size_valid"
    CHECK ("sizeBytes" > 0 AND "sizeBytes" <= 536870912);
