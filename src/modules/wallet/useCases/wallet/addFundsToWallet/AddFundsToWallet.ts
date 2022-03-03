import { UseCase } from "../../../../../shared/core/UseCase"
import { IWalletRepo } from "../../../repos/walletRepo"
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID"
import { Wallet } from "../../../domain/wallet"
import { Either, Result, left, right } from "../../../../../shared/core/Result"
import { AddFundsToWalletDTO } from "./AddFundsToWalletDTO"
import { AddFundsToWalletErrors } from "./AddFundsToWalletErrors"

type Response = Either<
  | AddFundsToWalletErrors.ErrorRetrievingWalletByOwnerId
  | AddFundsToWalletErrors.ErrorSavingWallet,
  Result<string>
>

export class AddFundsToWallet
  implements UseCase<AddFundsToWalletDTO, Promise<Response>>
{
  private walletRepo: IWalletRepo

  constructor(walletRepo: IWalletRepo) {
    this.walletRepo = walletRepo
  }

  public async execute(request: AddFundsToWalletDTO): Promise<Response> {
    const { ownerId: reqOwnerId, value } = request

    const ownerId = new UniqueEntityID(reqOwnerId) //TODO validate validity of owner id in a constructor that returns a Result

    const walletOrError = await this.walletRepo.getWalletByOwnerId(ownerId)

    if (walletOrError.isFailure) {
      return left(
        new AddFundsToWalletErrors.ErrorRetrievingWalletByOwnerId(
          walletOrError.error as string
        )
      )
    }

    const wallet = walletOrError.getValue()

    wallet.addFunds(value)

    const saveResult = await this.walletRepo.save(wallet)

    if (saveResult.isFailure) {
      return left(
        new AddFundsToWalletErrors.ErrorSavingWallet(saveResult.error as string)
      )
    }

    return right(
      Result.ok<string>(
        `funds added to wallet: ${wallet.walletId.toString()} | new balance: ${
          wallet.balance
        }`
      )
    )
  }
}
