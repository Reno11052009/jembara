ALTER TABLE "project_payment"
ADD COLUMN "reversedAmount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "project_payment"
ADD CONSTRAINT "project_payment_reversed_amount_valid"
CHECK ("reversedAmount" >= 0 AND "reversedAmount" <= "amount");

DROP INDEX "balance_transaction_projectPaymentId_key";

ALTER TABLE "balance_transaction"
ADD COLUMN "externalReference" VARCHAR(160);

ALTER TABLE "balance_transaction"
DROP CONSTRAINT "balance_transaction_amount_positive";

ALTER TABLE "balance_transaction"
DROP CONSTRAINT "balance_transaction_type_valid";

ALTER TABLE "balance_transaction"
ADD CONSTRAINT "balance_transaction_amount_non_zero"
CHECK ("amount" <> 0);

ALTER TABLE "balance_transaction"
ADD CONSTRAINT "balance_transaction_type_valid"
CHECK ("type" IN ('PROJECT_EARNING', 'PAYMENT_REFUND', 'PAYMENT_CHARGEBACK'));

CREATE UNIQUE INDEX "balance_transaction_externalReference_key"
ON "balance_transaction"("externalReference");

CREATE INDEX "balance_transaction_projectPaymentId_createdAt_idx"
ON "balance_transaction"("projectPaymentId", "createdAt");
