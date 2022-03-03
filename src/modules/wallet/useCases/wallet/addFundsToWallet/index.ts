import { AddFundsToWallet } from "./AddFundsToWallet"
import { walletRepo } from "../../../repos"

const addFundsToWallet = new AddFundsToWallet(walletRepo)

export { addFundsToWallet }
