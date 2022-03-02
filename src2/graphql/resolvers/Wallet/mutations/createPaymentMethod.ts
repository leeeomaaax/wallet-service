import { Resolver, Query, Mutation, Arg } from "type-graphql"
import { Service } from "typedi"
import Wallet from "../types/objects/Wallet"
import PaymentMethod from "../types/objects/PaymentMethod"
import WalletRepo from "../../../../repos/WalletRepo"
import CreatePaymentMethod from "../types/inputs/CreatePaymentMethod"

@Service()
@Resolver()
export default class CreatePaymentMethodResolver {
  constructor(private walletRepo: WalletRepo) {}

  @Mutation(() => PaymentMethod, {
    description: "Create a new paymentMethod in the database",
  })
  async createPaymentMethod(
    @Arg("input", () => CreatePaymentMethod)
    input: CreatePaymentMethod
  ): Promise<PaymentMethod> {
    const wallet = await this.walletRepo.getWalletByOwnerId(input.ownerId)
    const paymentMethod = await this.walletRepo.createPaymentMethod(
      input.ownerId,
      input.last4Digits,
      wallet.id
    )

    return paymentMethod
  }
}
