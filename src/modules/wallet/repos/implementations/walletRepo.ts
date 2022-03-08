import { IWalletRepo } from "../walletRepo"
import { Wallet } from "../../domain/wallet"
import { Transaction } from "../../domain/transaction"
import { WalletMap } from "../../mappers/walletMap"
import { TransactionMap } from "../../mappers/transactionMap"
import { Result } from "../../../../shared/core/Result"
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID"

import { PrismaClient, Prisma } from "@prisma/client"
import { getQldbDriver } from "../../../../shared/infra/database/qldb"
import { TransactionExecutor } from "amazon-qldb-driver-nodejs"
import { dom, dumpBinary, load } from "ion-js"

const prisma = new PrismaClient()

export class WalletRepo implements IWalletRepo {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public async save(wallet: Wallet): Promise<Result<void>> {
    try {
      const qldbDriver = getQldbDriver("wallet-dev")
      const exists = await prisma.wallet.findUnique({
        where: { ownerId: wallet.ownerId.toString() },
      })

      const walletPersitenceObj = WalletMap.toPersistence(wallet)
      //TODO do wallet update/create and trasaction create as a transaction
      if (!exists) {
        await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
          // This is critical to make this transaction idempotent
          const results: dom.Value[] = (
            await txn.execute(
              "SELECT * FROM wallets WHERE ownerId = ?",
              walletPersitenceObj.ownerId
            )
          ).getResultList()
          // Insert the document after ensuring it doesn't already exist
          if (results.length == 0) {
            const doc: Record<string, string | number | Date> =
              walletPersitenceObj
            await txn.execute("INSERT INTO wallets ?", doc)
          } else {
            return Result.fail<void>(
              `Wallet for ownerId ${wallet.ownerId} already existis in QLDB`
            )
          }
        })
        await this.prisma.wallet.create({
          data: walletPersitenceObj,
        })
      } else {
        await this.prisma.wallet.update({
          where: { ownerId: wallet.ownerId.toString() },
          data: WalletMap.toPersistence(wallet),
        })
      }
      if (!!wallet.currentSessionTransaction) {
        const transactionPersitenceObj = TransactionMap.toPersistence(
          wallet.currentSessionTransaction
        )
        await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
          // Check if doc with GovId:TOYENC486FH exists
          // This is critical to make this transaction idempotent
          const results: dom.Value[] = (
            await txn.execute(
              "SELECT * FROM transactions WHERE id = ?",
              transactionPersitenceObj.id
            )
          ).getResultList()
          // Insert the document after ensuring it doesn't already exist
          if (results.length == 0) {
            const doc: Record<string, string | number> =
              transactionPersitenceObj
            await txn.execute("INSERT INTO transactions ?", doc)
            await txn.execute(
              "UPDATE wallets SET balance = ?, updatedAt = ? WHERE ownerId = ?",
              walletPersitenceObj.balance,
              walletPersitenceObj.updatedAt,
              walletPersitenceObj.ownerId
            )
          } else {
            return Result.fail<void>(
              `Wallet transaction id ${transactionPersitenceObj.id} already existis in QLDB`
            )
          }
        })

        await this.prisma.transaction.create({
          data: transactionPersitenceObj,
        })
      }

      return Result.ok<void>()
    } catch (e) {
      console.log(e)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        return Result.fail<void>(`Prisma client error: ${e.code}`)
      } else {
        return Result.fail<void>(`WalletRepo.save error: ${e.message}}`)
      }
    }
  }

  public async getWalletByOwnerId(
    ownerId: UniqueEntityID
  ): Promise<Result<Wallet>> {
    try {
      const raw = await prisma.wallet.findUnique({
        where: { ownerId: ownerId.toString() },
      })
      return Result.ok<Wallet>(WalletMap.toDomain(raw).getValue()) //TODO do not assume toDomain will work
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Result.fail<Wallet>(`Prisma client error: ${e.code}`)
      } else {
        return Result.fail<Wallet>(`Prisma error: ${e.message}`)
      }
    }
  }

  public async getWalletTransactions(
    walletId: UniqueEntityID
  ): Promise<Result<Transaction[]>> {
    try {
      const raw = await prisma.transaction.findMany({
        where: { walletId: walletId.toString() },
      })
      return Result.ok<Transaction[]>(
        raw.map((t) => TransactionMap.toDomain(t).getValue())
      ) //TODO do not assume toDomain will work
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Result.fail<Transaction[]>(`Prisma client error: ${e.code}`)
      } else {
        return Result.fail<Transaction[]>(`Prisma error`)
      }
    }
  }
}
