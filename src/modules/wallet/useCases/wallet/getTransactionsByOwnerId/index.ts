import { GetTransactionsByOwnerId } from "./getTransactionsByOwnerId"
import { walletRepo } from "../../../repos"

const getTransactionsByOwnerId = new GetTransactionsByOwnerId(walletRepo)

export { getTransactionsByOwnerId }
