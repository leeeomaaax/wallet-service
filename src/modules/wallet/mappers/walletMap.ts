import { Wallet } from "../domain/wallet"
import { WalletDTO } from "../dtos/walletDTO"
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID"
import { Result } from "../../../shared/core/Result"
import { Wallet as WalletPersistenceSchema } from "@prisma/client"

export class WalletMap {
  public static toDomain(raw: WalletPersistenceSchema): Result<Wallet> {
    const walletOrError = Wallet.create(
      {
        ownerId: new UniqueEntityID(raw.ownerId),
        balance: raw.balance, //TODO create value object for Money
      },
      new UniqueEntityID(raw.id)
    )

    if (walletOrError.isFailure) {
      return Result.fail<Wallet>("WalletMap toDomain failed")
    }
    return Result.ok<Wallet>(walletOrError.getValue())
  }

  public static toPersistence(wallet: Wallet): WalletPersistenceSchema {
    return {
      id: wallet.walletId.toString(),
      ownerId: wallet.ownerId.toString(),
      balance: wallet.balance,
      createdAt: new Date(), //TODO implement
      updatedAt: new Date(), //TODO implement
    }
  }

  public static toDTO(wallet: Wallet): WalletDTO {
    return {
      ownerId: wallet.ownerId.toString(),
      balance: wallet.balance,
    }
  }
}
