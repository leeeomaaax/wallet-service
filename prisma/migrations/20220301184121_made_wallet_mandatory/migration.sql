/*
  Warnings:

  - Made the column `walletId` on table `PaymentMethod` required. This step will fail if there are existing NULL values in that column.
  - Made the column `walletId` on table `Transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PaymentMethod" DROP CONSTRAINT "PaymentMethod_walletId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_walletId_fkey";

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "walletId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "walletId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
