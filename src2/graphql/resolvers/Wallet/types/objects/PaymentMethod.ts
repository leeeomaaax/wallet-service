import { ObjectType, Field, Int, ID } from "type-graphql"

@ObjectType()
export default class PaymentMethod {
  @Field(() => ID)
  id!: string

  @Field()
  creditCardLast4Digits!: string
}
