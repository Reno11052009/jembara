-- Withdrawal requests reserve a student's available balance until an admin
-- either confirms the manual transfer or rejects and refunds the request.
CREATE TABLE "withdrawal_request" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "provider" VARCHAR(80) NOT NULL,
    "accountName" VARCHAR(120) NOT NULL,
    "accountNumber" VARCHAR(40) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNote" VARCHAR(500),
    "processedByUserId" UUID,
    "processedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "withdrawal_request_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "withdrawal_request_amount_check" CHECK ("amount" >= 10000),
    CONSTRAINT "withdrawal_request_status_check" CHECK ("status" IN ('PENDING', 'COMPLETED', 'REJECTED'))
);

ALTER TABLE "balance_transaction"
    ALTER COLUMN "projectPaymentId" DROP NOT NULL,
    ADD COLUMN "withdrawalId" UUID;

CREATE INDEX "withdrawal_request_userId_createdAt_idx"
    ON "withdrawal_request"("userId", "createdAt");

CREATE INDEX "withdrawal_request_status_createdAt_idx"
    ON "withdrawal_request"("status", "createdAt");

CREATE INDEX "withdrawal_request_processedByUserId_processedAt_idx"
    ON "withdrawal_request"("processedByUserId", "processedAt");

CREATE INDEX "balance_transaction_withdrawalId_createdAt_idx"
    ON "balance_transaction"("withdrawalId", "createdAt");

ALTER TABLE "withdrawal_request"
    ADD CONSTRAINT "withdrawal_request_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "withdrawal_request"
    ADD CONSTRAINT "withdrawal_request_processedByUserId_fkey"
    FOREIGN KEY ("processedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "balance_transaction"
    ADD CONSTRAINT "balance_transaction_withdrawalId_fkey"
    FOREIGN KEY ("withdrawalId") REFERENCES "withdrawal_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "balance_transaction"
    ADD CONSTRAINT "balance_transaction_source_check"
    CHECK (num_nonnulls("projectPaymentId", "withdrawalId") = 1);
