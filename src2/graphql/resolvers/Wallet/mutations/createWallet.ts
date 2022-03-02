import { Resolver, Query, Mutation, Arg } from "type-graphql"
import { Service } from "typedi"
import Wallet from "../types/objects/Wallet"
import WalletRepo from "../../../../repos/WalletRepo"
import CreateWallet from "../types/inputs/CreateWallet"

@Service()
@Resolver()
export default class CreateWalletResolver {
  constructor(private walletRepo: WalletRepo) {}

  @Mutation(() => Wallet, { description: "Create a new pet in the database" })
  async createWallet(
    @Arg("input", () => CreateWallet)
    input: CreateWallet
  ): Promise<Wallet> {
    const wallet = await this.walletRepo.create(input.ownerId)
    const returnWallet = {
      ...wallet,
      transactions: [],
      paymentMethods: [],
    }
    return returnWallet
  }
}
