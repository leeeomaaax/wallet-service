import { UseCase } from "../../../../../shared/core/UseCase"
import { IWalletRepo } from "../../../repos/walletRepo"
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID"
import { Wallet } from "../../../domain/wallet"
import { WalletMap } from "../../../mappers/walletMap"
import { WalletDTO } from "../../../dtos/walletDTO"
import { Either, Result, left, right } from "../../../../../shared/core/Result"
import { GetWalletByOwnerIdDTO } from "./getWalletByOwnerIdDTO"
import { GetWalletByOwnerIdErrors } from "./getWalletByOwnerIdErrors"

type Response = Either<
  GetWalletByOwnerIdErrors.ErrorRetrievingWalletByOwnerId,
  Result<WalletDTO>
>

export class GetWalletByOwnerId
  implements UseCase<GetWalletByOwnerIdDTO, Promise<Response>>
{
  private walletRepo: IWalletRepo

  constructor(walletRepo: IWalletRepo) {
    this.walletRepo = walletRepo
  }

  public async execute(request: GetWalletByOwnerIdDTO): Promise<Response> {
    const { ownerId: reqOwnerId } = request

    const ownerId = new UniqueEntityID(reqOwnerId) //TODO validate validity of owner id in a constructor that returns a Result

    const walletOrError = await this.walletRepo.getWalletByOwnerId(ownerId)

    if (walletOrError.isFailure) {
      return left(
        new GetWalletByOwnerIdErrors.ErrorRetrievingWalletByOwnerId(
          walletOrError.error as string
        )
      )
    }

    const wallet = walletOrError.getValue()

    return right(Result.ok<WalletDTO>(WalletMap.toDTO(wallet)))
  }
}
