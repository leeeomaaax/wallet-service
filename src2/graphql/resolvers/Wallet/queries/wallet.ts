import { Service } from "typedi"
import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql"
import Wallet from "../types/objects/Wallet"
import WalletRepo from "../../../../repos/WalletRepo"

@Service()
@Resolver((of) => Wallet)
export default class GetWalletResolver {
  constructor(private walletRepo: WalletRepo) {}

  @Query(() => Wallet, { description: "Wallet by user" })
  async wallet(@Arg("id") id: string): Promise<Wallet> {
    const wallet = await this.walletRepo.getWalletByOwnerId(id)
    console.log(wallet)

    const returnWallet = {
      ...wallet,
      transactions: [],
      paymentMethods: [],
    }
    return returnWallet
  }

  @FieldResolver()
  async paymentMethods(@Root() wallet: Wallet) {
    const paymentMethods = await this.walletRepo.getPaymentMethodsByOwnerId(
      wallet.ownerId
    )
    // if (!author) throw new SomethingWentWrongError()
    return paymentMethods
  }

  @FieldResolver()
  async transactions(@Root() wallet: Wallet) {
    const transactions = await this.walletRepo.getTransactionsByOwnerId(
      wallet.ownerId
    )
    // if (!author) throw new SomethingWentWrongError()
    return transactions
  }
}
