import { WalletRepo } from "./implementations/walletRepo"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const walletRepo = new WalletRepo(prisma)

export { walletRepo }
