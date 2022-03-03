import { SubtractFundsFromWallet } from "./SubtractFundsFromWallet"
import { walletRepo } from "../../../repos"

const subtractFundsFromWallet = new SubtractFundsFromWallet(walletRepo)

export { subtractFundsFromWallet }
