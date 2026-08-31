CREATE TABLE "project_payment" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "orderId" VARCHAR(50) NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREATING',
    "snapToken" TEXT,
    "redirectUrl" TEXT,
    "midtransTransactionId" TEXT,
    "paymentType" TEXT,
    "fraudStatus" TEXT,
    "rawStatus" JSONB,
    "paidAt" TIMESTAMP(6),
    "heldAt" TIMESTAMP(6),
    "releasedAt" TIMESTAMP(6),
    "releasedToUserId" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "project_payment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "project_payment_amount_positive" CHECK ("amount" > 0),
    CONSTRAINT "project_payment_status_valid" CHECK ("status" IN ('CREATING', 'PENDING', 'HELD', 'RELEASED', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED', 'CHARGEBACK'))
);

CREATE TABLE "balance_transaction" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "projectPaymentId" UUID NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PROJECT_EARNING',
    "amount" INTEGER NOT NULL,
    "balanceBefore" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balance_transaction_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "balance_transaction_amount_positive" CHECK ("amount" > 0),
    CONSTRAINT "balance_transaction_type_valid" CHECK ("type" = 'PROJECT_EARNING'),
    CONSTRAINT "balance_transaction_balance_consistent" CHECK ("balanceAfter" = "balanceBefore" + "amount")
);

CREATE TABLE "project_submission" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "resultUrl" TEXT,
    "notes" VARCHAR(3000) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "project_submission_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "project_submission_status_valid" CHECK ("status" IN ('SUBMITTED', 'APPROVED'))
);

CREATE UNIQUE INDEX "project_payment_projectId_key" ON "project_payment"("projectId");
CREATE UNIQUE INDEX "project_payment_orderId_key" ON "project_payment"("orderId");
CREATE INDEX "project_payment_status_createdAt_idx" ON "project_payment"("status", "createdAt");
CREATE INDEX "project_payment_releasedToUserId_releasedAt_idx" ON "project_payment"("releasedToUserId", "releasedAt");
CREATE UNIQUE INDEX "balance_transaction_projectPaymentId_key" ON "balance_transaction"("projectPaymentId");
CREATE INDEX "balance_transaction_userId_createdAt_idx" ON "balance_transaction"("userId", "createdAt");
CREATE UNIQUE INDEX "project_submission_projectId_key" ON "project_submission"("projectId");
CREATE INDEX "project_submission_studentId_submittedAt_idx" ON "project_submission"("studentId", "submittedAt");

ALTER TABLE "project_payment" ADD CONSTRAINT "project_payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_payment" ADD CONSTRAINT "project_payment_releasedToUserId_fkey" FOREIGN KEY ("releasedToUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "balance_transaction" ADD CONSTRAINT "balance_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "balance_transaction" ADD CONSTRAINT "balance_transaction_projectPaymentId_fkey" FOREIGN KEY ("projectPaymentId") REFERENCES "project_payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "project_submission" ADD CONSTRAINT "project_submission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_submission" ADD CONSTRAINT "project_submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
