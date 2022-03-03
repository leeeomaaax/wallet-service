import { CreateWallet } from "./CreateWallet"
import { walletRepo } from "../../../repos"

const createWallet = new CreateWallet(walletRepo)

export { createWallet }
