import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace GetTransactionsByOwnerIdErrors {
  export class ErrorRetrievingWalletByOwnerId extends Result<UseCaseError> {
    constructor(msg: string) {
      super(false, {
        message: `Could not get wallet by ownerId: ${msg}`,
      } as UseCaseError)
    }
  }
  export class ErrorRetrievingTransactions extends Result<UseCaseError> {
    constructor(msg: string) {
      super(false, {
        message: `Could not get wallet transactions: ${msg}`,
      } as UseCaseError)
    }
  }
}
