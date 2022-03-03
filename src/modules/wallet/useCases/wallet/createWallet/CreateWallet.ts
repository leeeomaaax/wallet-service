import { UseCase } from "../../../../../shared/core/UseCase"
import { IWalletRepo } from "../../../repos/walletRepo"
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID"
import { Wallet } from "../../../domain/wallet"
import { Either, Result, left, right } from "../../../../../shared/core/Result"
import { CreateWalletDTO } from "./CreateWalletDTO"
import { CreateWalletErrors } from "./CreateWalletErrors"

type Response = Either<
  CreateWalletErrors.ErrorCreatingWallet | CreateWalletErrors.ErrorSavingWallet,
  Result<string>
>

export class CreateWallet
  implements UseCase<CreateWalletDTO, Promise<Response>>
{
  private walletRepo: IWalletRepo

  constructor(walletRepo: IWalletRepo) {
    this.walletRepo = walletRepo
  }

  public async execute(request: CreateWalletDTO): Promise<Response> {
    const { ownerId: reqOwnerId } = request

    const ownerId = new UniqueEntityID(reqOwnerId) //TODO validate validity of owner id in a constructor that returns a Result

    const walletOrError = Wallet.create({ ownerId, balance: 0 })

    if (walletOrError.isFailure) {
      return left(new CreateWalletErrors.ErrorCreatingWallet())
    }

    const wallet = walletOrError.getValue()

    const saveResult = await this.walletRepo.save(wallet)

    if (saveResult.isFailure) {
      return left(new CreateWalletErrors.ErrorSavingWallet())
    }

    return right(
      Result.ok<string>(`wallet created: ${wallet.walletId.toString()}`)
    )
  }
}
