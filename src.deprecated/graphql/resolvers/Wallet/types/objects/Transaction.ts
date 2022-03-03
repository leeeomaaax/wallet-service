import { ObjectType, Field, ID, Int } from "type-graphql"

@ObjectType()
export default class PaymentMethod {
  @Field(() => ID)
  id!: string

  @Field(() => Int)
  value!: number
}
