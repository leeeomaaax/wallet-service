import { ObjectType, Field, Int, ID } from "type-graphql"
import PaymentMethod from "./PaymentMethod"
import Transaction from "./Transaction"

@ObjectType()
export default class Wallet {
  @Field(() => ID)
  id!: string

  @Field(() => ID)
  ownerId!: string

  @Field(() => Int)
  balance!: number

  @Field(() => [PaymentMethod!]!)
  paymentMethods!: PaymentMethod[]

  @Field(() => [PaymentMethod!]!)
  transactions!: Transaction[]
}
