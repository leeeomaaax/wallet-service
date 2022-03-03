import { UseCase } from "../../../../../shared/core/UseCase"
import { IWalletRepo } from "../../../repos/walletRepo"
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID"
import { Wallet } from "../../../domain/wallet"
import { Either, Result, left, right } from "../../../../../shared/core/Result"
import { SubtractFundsFromWalletDTO } from "./SubtractFundsFromWalletDTO"
import { SubtractFundsFromWalletErrors } from "./SubtractFundsFromWalletErrors"

type Response = Either<
  | SubtractFundsFromWalletErrors.ErrorRetrievingWalletByOwnerId
  | SubtractFundsFromWalletErrors.ErrorSavingWallet,
  Result<string>
>

export class SubtractFundsFromWallet
  implements UseCase<SubtractFundsFromWalletDTO, Promise<Response>>
{
  private walletRepo: IWalletRepo

  constructor(walletRepo: IWalletRepo) {
    this.walletRepo = walletRepo
  }

  public async execute(request: SubtractFundsFromWalletDTO): Promise<Response> {
    const { ownerId: reqOwnerId, value } = request

    const ownerId = new UniqueEntityID(reqOwnerId) //TODO validate validity of owner id in a constructor that returns a Result

    const walletOrError = await this.walletRepo.getWalletByOwnerId(ownerId)

    if (walletOrError.isFailure) {
      return left(
        new SubtractFundsFromWalletErrors.ErrorRetrievingWalletByOwnerId(
          walletOrError.error as string
        )
      )
    }

    const wallet = walletOrError.getValue()

    wallet.subtractFunds(value)

    const saveResult = await this.walletRepo.save(wallet)

    if (saveResult.isFailure) {
      return left(
        new SubtractFundsFromWalletErrors.ErrorSavingWallet(
          saveResult.error as string
        )
      )
    }

    return right(
      Result.ok<string>(
        `funds subtracted from wallet: ${wallet.walletId.toString()} | new balance: ${
          wallet.balance
        }`
      )
    )
  }
}
