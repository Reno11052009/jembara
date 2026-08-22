-- CreateTable
CREATE TABLE "notification_preference" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "proposalMasuk" BOOLEAN NOT NULL DEFAULT true,
    "pesanBaru" BOOLEAN NOT NULL DEFAULT true,
    "pembayaran" BOOLEAN NOT NULL DEFAULT true,
    "updateProyek" BOOLEAN NOT NULL DEFAULT true,
    "promosiInfo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "notification_preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_preference_userId_key" ON "notification_preference"("userId");

-- AddForeignKey
ALTER TABLE "notification_preference" ADD CONSTRAINT "notification_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
