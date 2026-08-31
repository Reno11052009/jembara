-- CreateTable
CREATE TABLE "message" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "recipientId" UUID NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "readAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "message_distinct_participants" CHECK ("senderId" <> "recipientId"),
    CONSTRAINT "message_content_not_blank" CHECK (length(btrim("content")) > 0)
);

-- CreateIndex
CREATE INDEX "message_projectId_createdAt_idx" ON "message"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "message_recipientId_readAt_idx" ON "message"("recipientId", "readAt");

-- CreateIndex
CREATE INDEX "message_senderId_createdAt_idx" ON "message"("senderId", "createdAt");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
