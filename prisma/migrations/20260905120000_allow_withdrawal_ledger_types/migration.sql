-- Extend the balance ledger constraint for withdrawal reservations and refunds.
ALTER TABLE "balance_transaction"
    DROP CONSTRAINT "balance_transaction_type_valid";

ALTER TABLE "balance_transaction"
    ADD CONSTRAINT "balance_transaction_type_valid"
    CHECK (
        "type" IN (
            'PROJECT_EARNING',
            'PAYMENT_REFUND',
            'PAYMENT_CHARGEBACK',
            'WITHDRAWAL_RESERVE',
            'WITHDRAWAL_REFUND'
        )
    );
