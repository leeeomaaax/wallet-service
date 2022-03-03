import { Wallet } from "../domain/wallet"
import { Transaction } from "../domain/transaction"
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID"
import { Result } from "../../../shared/core/Result"

export interface IWalletRepo {
  save(wallet: Wallet): Promise<Result<void>>
  getWalletByOwnerId(ownerId: UniqueEntityID): Promise<Result<Wallet>>
  getWalletTransactions(
    walletId: UniqueEntityID
  ): Promise<Result<Transaction[]>>
}
