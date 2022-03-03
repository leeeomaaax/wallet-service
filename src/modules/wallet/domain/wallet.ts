import { Entity } from "../../../shared/domain/Entity"
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID"
import { Result, Either, left, right } from "../../../shared/core/Result"
import { Transaction } from "./transaction"

export interface WalletProps {
  ownerId: UniqueEntityID
  balance: number
}

export class Wallet extends Entity<WalletProps> {
  public currentSessionTransaction: Transaction

  get walletId(): UniqueEntityID {
    return this._id
  }

  get ownerId(): UniqueEntityID {
    return this.props.ownerId
  }

  get balance(): number {
    return this.props.balance
  }

  public addFunds(value: number): Result<void> {
    if (!!this.currentSessionTransaction)
      return Result.fail<void>(
        "Transaction already created for this wallet instance. TODO: allow multiple transactions."
      )
    const transactionOrError = Transaction.create({
      value,
      type: "credit",
      ownerId: this.props.ownerId,
      walletId: this.walletId,
      description: "Default credit transaction description",
    })
    if (transactionOrError.isFailure)
      return Result.fail<void>(transactionOrError.error as string)
    this.props.balance = this.props.balance + value
    this.currentSessionTransaction = transactionOrError.getValue()
    return Result.ok<void>()
  }

  public subtractFunds(value: number): Result<void> {
    if (!!this.currentSessionTransaction)
      return Result.fail<void>(
        "Transaction already created for this wallet instance. TODO: allow multiple transactions."
      )
    const transactionOrError = Transaction.create({
      value,
      type: "debt",
      ownerId: this.props.ownerId,
      walletId: this.walletId,
      description: "Default debt transaction description",
    })
    if (transactionOrError.isFailure)
      return Result.fail<void>(transactionOrError.error as string)
    this.props.balance = this.props.balance - value
    this.currentSessionTransaction = transactionOrError.getValue()
    return Result.ok<void>()
  }

  private constructor(props: WalletProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: WalletProps,
    id?: UniqueEntityID
  ): Result<Wallet> {
    const wallet = new Wallet(props, id)

    return Result.ok<Wallet>(wallet)
  }
}
