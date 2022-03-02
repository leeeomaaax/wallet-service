import { Field, InputType, Int } from "type-graphql";

@InputType({ description: "Create new wallet input" })
export default class CreateWalletInput {
  @Field()
  ownerId!: string;
}
