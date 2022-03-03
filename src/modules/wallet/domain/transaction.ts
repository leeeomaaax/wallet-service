import { Entity } from "../../../shared/domain/Entity"
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID"
import { Result, Either, left, right } from "../../../shared/core/Result"

type TransactionType = "debt" | "credit"

export interface TransactionProps {
  ownerId: UniqueEntityID
  walletId: UniqueEntityID
  type: TransactionType
  value: number
  description: string
}

export class Transaction extends Entity<TransactionProps> {
  get transactionId(): UniqueEntityID {
    return this._id
  }

  get walletId(): UniqueEntityID {
    return this.props.walletId
  }

  get ownerId(): UniqueEntityID {
    return this.props.ownerId
  }

  get type(): TransactionType {
    return this.props.type
  }

  get value(): number {
    return this.props.value
  }

  get description(): string {
    return this.props.description
  }

  private constructor(props: TransactionProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: TransactionProps,
    id?: UniqueEntityID
  ): Result<Transaction> {
    if (props.value <= 0)
      return Result.fail<Transaction>(
        "Transaction value should be bigger than 0"
      )

    if (props.value % 1 > 0)
      return Result.fail<Transaction>(
        "Transaction value should be in cents, so no decimals are allowed"
      )

    const transaction = new Transaction(props, id)

    return Result.ok<Transaction>(transaction)
  }
}
