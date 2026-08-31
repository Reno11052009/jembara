-- CreateTable
CREATE TABLE "auth_session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "userAgent" VARCHAR(512),
    "ipAddress" VARCHAR(64),
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "lastSeenAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_rate_limit" (
    "key" VARCHAR(96) NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "security_rate_limit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "auth_session_userId_expiresAt_idx" ON "auth_session"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "auth_session_expiresAt_idx" ON "auth_session"("expiresAt");

-- CreateIndex
CREATE INDEX "security_rate_limit_resetAt_idx" ON "security_rate_limit"("resetAt");

-- AddForeignKey
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
