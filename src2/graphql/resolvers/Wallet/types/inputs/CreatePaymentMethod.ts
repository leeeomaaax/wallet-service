import { Field, InputType, Int } from "type-graphql"

@InputType({ description: "Create new payment method for ownerid" })
export default class CreatePaymentMethodInput {
  @Field()
  ownerId!: string

  @Field()
  last4Digits!: string
}
