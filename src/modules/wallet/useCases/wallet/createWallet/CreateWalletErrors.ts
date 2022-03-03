import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace CreateWalletErrors {
  export class ErrorCreatingWallet extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Could not instanciate wallet`,
      } as UseCaseError)
    }
  }

  export class ErrorSavingWallet extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Could not save wallet to database`,
      } as UseCaseError)
    }
  }
}
