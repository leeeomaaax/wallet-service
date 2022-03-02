-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "walletId" TEXT,
    "paymentMethodId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "debtWithheldValue" INTEGER NOT NULL,
    "debtSettledValue" INTEGER NOT NULL,
    "debtWMetadata" TEXT NOT NULL,
    "creditValue" INTEGER NOT NULL,
    "creditStripeState" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "creditCardProvider" TEXT NOT NULL,
    "creditCardStripeToken" TEXT NOT NULL,
    "creditCardLast4Digits" TEXT NOT NULL,
    "walletId" TEXT,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_ownerId_key" ON "Transactions"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_ownerId_key" ON "PaymentMethod"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_creditCardStripeToken_key" ON "PaymentMethod"("creditCardStripeToken");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_ownerId_key" ON "Wallet"("ownerId");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
