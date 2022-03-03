import { Service } from "typedi"
const { v4: uuidv4 } = require("uuid")
import {
  PrismaClient,
  Prisma,
  Wallet,
  PaymentMethod,
  Transactions,
} from "@prisma/client"
import Wallet from "../src2/graphql/resolvers/Wallet"

const prisma = new PrismaClient()

@Service()
export default class WalletRepo {
  async create(ownerId: string): Promise<Wallet> {
    const wallet = await prisma.wallet.create({ data: { ownerId: ownerId } })
    return wallet
  }

  async createPaymentMethod(
    ownerId: string,
    last4Digits: string,
    walletId: string
  ): Promise<PaymentMethod> {
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        ownerId: ownerId,
        creditCardLast4Digits: last4Digits,
        type: "card",
        creditCardProvider: "master",
        creditCardStripeToken: uuidv4(),
        walletId: walletId,
      },
    })
    return paymentMethod
  }

  async getWalletByOwnerId(ownerId: string): Promise<Wallet> {
    const prismaObject = await prisma.wallet.findUnique({
      where: { ownerId: ownerId },
    })
    try {
      const wallet = Wallet.create(prismaObject)
    } catch (e) {}
    return prismaObject
  }

  async getPaymentMethodsByOwnerId(ownerId: string): Promise<PaymentMethod[]> {
    const prismaObject = await prisma.paymentMethod.findMany({
      where: { ownerId: ownerId },
    })
    return prismaObject
  }

  async getTransactionsByOwnerId(ownerId: string): Promise<Transactions[]> {
    const prismaObject = await prisma.transactions.findMany({
      where: { ownerId: ownerId },
    })
    return prismaObject
  }
}
