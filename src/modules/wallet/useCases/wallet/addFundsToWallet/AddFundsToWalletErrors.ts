import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace AddFundsToWalletErrors {
  export class ErrorRetrievingWalletByOwnerId extends Result<UseCaseError> {
    constructor(msg: string) {
      super(false, {
        message: `Could not get wallet by ownerId: ${msg}`,
      } as UseCaseError)
    }
  }

  export class ErrorSavingWallet extends Result<UseCaseError> {
    constructor(msg: string) {
      super(false, {
        message: `Could not save wallet to database: ${msg}`,
      } as UseCaseError)
    }
  }
}
