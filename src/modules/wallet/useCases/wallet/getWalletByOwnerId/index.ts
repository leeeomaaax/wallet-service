import { GetWalletByOwnerId } from "./getWalletByOwnerId"
import { walletRepo } from "../../../repos"

const getWalletByOwnerId = new GetWalletByOwnerId(walletRepo)

export { getWalletByOwnerId }
