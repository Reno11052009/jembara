CREATE TABLE "payout_method" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" VARCHAR(80) NOT NULL,
    "accountName" VARCHAR(120) NOT NULL,
    "accountNumber" VARCHAR(40) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "payout_method_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "withdrawal_request"
    ADD COLUMN "payoutMethodId" UUID;

CREATE UNIQUE INDEX "payout_method_userId_provider_accountNumber_key"
    ON "payout_method"("userId", "provider", "accountNumber");

CREATE INDEX "payout_method_userId_isPrimary_createdAt_idx"
    ON "payout_method"("userId", "isPrimary", "createdAt");

CREATE UNIQUE INDEX "payout_method_one_primary_per_user"
    ON "payout_method"("userId") WHERE "isPrimary" = true;

CREATE INDEX "withdrawal_request_payoutMethodId_idx"
    ON "withdrawal_request"("payoutMethodId");

ALTER TABLE "payout_method"
    ADD CONSTRAINT "payout_method_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "withdrawal_request"
    ADD CONSTRAINT "withdrawal_request_payoutMethodId_fkey"
    FOREIGN KEY ("payoutMethodId") REFERENCES "payout_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;
