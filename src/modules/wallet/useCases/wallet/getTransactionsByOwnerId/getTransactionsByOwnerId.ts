import { UseCase } from "../../../../../shared/core/UseCase"
import { IWalletRepo } from "../../../repos/walletRepo"
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID"
import { Wallet } from "../../../domain/wallet"
import { TransactionDTO } from "../../../dtos/transactionDTO"
import { TransactionMap } from "../../../mappers/transactionMap"
import { Either, Result, left, right } from "../../../../../shared/core/Result"
import { GetTransactionsByOwnerIdDTO } from "./getTransactionsByOwnerIdDTO"
import { GetTransactionsByOwnerIdErrors } from "./getTransactionsByOwnerIdErrors"

type Response = Either<
  | GetTransactionsByOwnerIdErrors.ErrorRetrievingWalletByOwnerId
  | GetTransactionsByOwnerIdErrors.ErrorRetrievingTransactions,
  Result<TransactionDTO[]>
>

export class GetTransactionsByOwnerId
  implements UseCase<GetTransactionsByOwnerIdDTO, Promise<Response>>
{
  private walletRepo: IWalletRepo

  constructor(walletRepo: IWalletRepo) {
    this.walletRepo = walletRepo
  }

  public async execute(
    request: GetTransactionsByOwnerIdDTO
  ): Promise<Response> {
    const { ownerId: reqOwnerId } = request

    const ownerId = new UniqueEntityID(reqOwnerId) //TODO validate validity of owner id in a constructor that returns a Result

    const walletOrError = await this.walletRepo.getWalletByOwnerId(ownerId)

    if (walletOrError.isFailure) {
      return left(
        new GetTransactionsByOwnerIdErrors.ErrorRetrievingWalletByOwnerId(
          walletOrError.error as string
        )
      )
    }

    const wallet = walletOrError.getValue()

    const transactionsOrError = await this.walletRepo.getWalletTransactions(
      wallet.walletId
    )

    if (transactionsOrError.isFailure) {
      return left(
        new GetTransactionsByOwnerIdErrors.ErrorRetrievingTransactions(
          walletOrError.error as string
        )
      )
    }

    const transactions = transactionsOrError.getValue()

    return right(
      Result.ok<TransactionDTO[]>(transactions.map(TransactionMap.toDTO))
    )
  }
}
