-- CreateTable
CREATE TABLE "message_attachment" (
    "id" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "storagePath" VARCHAR(1024) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "contentType" VARCHAR(255) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attachment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "message_attachment_size_valid" CHECK ("sizeBytes" > 0 AND "sizeBytes" <= 5368709120)
);

-- CreateIndex
CREATE UNIQUE INDEX "message_attachment_messageId_key" ON "message_attachment"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "message_attachment_storagePath_key" ON "message_attachment"("storagePath");

-- CreateIndex
CREATE INDEX "message_attachment_createdAt_idx" ON "message_attachment"("createdAt");

-- AddForeignKey
ALTER TABLE "message_attachment" ADD CONSTRAINT "message_attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "message_attachment_upload" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "uploaderId" UUID NOT NULL,
    "storagePath" VARCHAR(1024) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "contentType" VARCHAR(255) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attachment_upload_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "message_attachment_upload_size_valid" CHECK ("sizeBytes" > 0 AND "sizeBytes" <= 5368709120)
);

-- CreateIndex
CREATE UNIQUE INDEX "message_attachment_upload_storagePath_key" ON "message_attachment_upload"("storagePath");

-- CreateIndex
CREATE INDEX "message_attachment_upload_uploaderId_expiresAt_idx" ON "message_attachment_upload"("uploaderId", "expiresAt");

-- CreateIndex
CREATE INDEX "message_attachment_upload_projectId_createdAt_idx" ON "message_attachment_upload"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "message_attachment_upload_expiresAt_idx" ON "message_attachment_upload"("expiresAt");

-- AddForeignKey
ALTER TABLE "message_attachment_upload" ADD CONSTRAINT "message_attachment_upload_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachment_upload" ADD CONSTRAINT "message_attachment_upload_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
