import { Wallet } from "../domain/wallet"
import { Transaction } from "../domain/transaction"
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID"
import { Result } from "../../../shared/core/Result"
import { Transaction as TransactionPersistenceSchema } from "@prisma/client"

export class TransactionMap {
  public static toDomain(
    raw: TransactionPersistenceSchema
  ): Result<Transaction> {
    if (raw.type !== "debt" && raw.type !== "credit") {
      return Result.fail<Transaction>("Invalid transaction type")
    }
    const transactionOrError = Transaction.create(
      {
        ownerId: new UniqueEntityID(raw.ownerId),
        walletId: new UniqueEntityID(raw.walletId),
        type: raw.type,
        value: raw.value,
        description: raw.description,
      },
      new UniqueEntityID(raw.id)
    )

    if (transactionOrError.isFailure) {
      return Result.fail<Transaction>("TransactionMap toDomain failed")
    }
    return Result.ok<Transaction>(transactionOrError.getValue())
  }

  public static toPersistence(
    transaction: Transaction
  ): TransactionPersistenceSchema {
    return {
      id: transaction.transactionId.toString(),
      ownerId: transaction.ownerId.toString(),
      walletId: transaction.walletId.toString(),
      type: transaction.type,
      value: transaction.value,
      description: transaction.description,
    }
  }
}
