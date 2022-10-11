import { QldbDriver, RetryConfig } from "amazon-qldb-driver-nodejs"
import { Agent } from "https"
import { QLDBSessionClientConfig } from "@aws-sdk/client-qldb-session"
import { NodeHttpHandlerOptions } from "@aws-sdk/node-http-handler"
import { TransactionExecutor } from "amazon-qldb-driver-nodejs"
import { dom, dumpBinary, load } from "ion-js"
import { v4 as uuidv4 } from "uuid"

const maxConcurrentTransactions: number = 10
const retryLimit: number = 4

//Reuse connections with keepAlive
const lowLevelClientHttpOptions: NodeHttpHandlerOptions = {
  httpAgent: new Agent({
    maxSockets: maxConcurrentTransactions,
  }),
}

// Use driver's default backoff function for this example (no second parameter provided to RetryConfig)
const retryConfig: RetryConfig = new RetryConfig(retryLimit)

const credentials = {
  accessKeyId: "foobar",
  secretAccessKey: "foobar",
}
const serviceConfigurationOptions: QLDBSessionClientConfig = {
  region: "us-east-1",
  credentials,
  tls: false,
  endpoint: "https://localhost.localstack.cloud:4566",
}

export const getQldbDriver = (ledgerName: string): QldbDriver => {
  // ledgerName: string, qldbClientOptions?: ClientConfiguration, maxConcurrentTransactions?: number, retryConfig?: RetryConfig
  return new QldbDriver(
    ledgerName,
    serviceConfigurationOptions,
    lowLevelClientHttpOptions,
    maxConcurrentTransactions,
    retryConfig
  )
}

const qldb = getQldbDriver("ledger")

const createTable = async () => {
  try {
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      await txn.execute("CREATE TABLE transactions")
    })
  } catch (e) {
    console.log(e)
  }
}

const listTables = async () => {
  try {
    const tables = await qldb.getTableNames()
    console.log(tables)
  } catch (e) {
    console.log(e)
  }
}

const listAccounts = async () => {
  try {
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      // This is critical to make this transaction idempotent
      const results: dom.Value[] = (
        await txn.execute("SELECT * FROM accounts")
      ).getResultList()
      console.log(JSON.stringify(results, null, 2))
    })
  } catch (e) {
    console.log(e)
  }
}
const listTransactions = async () => {
  try {
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      // This is critical to make this transaction idempotent
      const results: dom.Value[] = (
        await txn.execute("SELECT * FROM transactions")
      ).getResultList()
      console.log(JSON.stringify(results, null, 2))
    })
  } catch (e) {
    console.log(e)
  }
}

const createAccount = async (accountId: string) => {
  try {
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      // This is critical to make this transaction idempotent
      const results: dom.Value[] = (
        await txn.execute(
          "SELECT * FROM accounts WHERE accountId = ?",
          accountId
        )
      ).getResultList()
      console.log(results)
      // Insert the document after ensuring it doesn't already exist
      if (results.length == 0) {
        const doc: Record<string, string | number | Date> = {
          accountId,
          balance: 0,
        }
        await txn.execute("INSERT INTO accounts ?", doc)
      } else {
        console.error("nope")
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const entriesForTransfer1 = [
  { accountId: "wallet-1", amount: 100, type: "debit" },
  { accountId: "wallet-2", amount: 100, type: "credit" },
]
const entriesForTransfer2 = [
  { accountId: "wallet-1", amount: 100, type: "debit" },
  { accountId: "wallet-2", amount: 97, type: "credit" },
  { accountId: "wallet-3", amount: 3, type: "credit" },
]

const updateBalance = async (accountId: string, amount: number) => {
  try {
    // const ionAccountId = load(accountId)
    // const ionAmount = load(amount)
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      await txn.execute(
        `UPDATE accounts AS a
WHERE a.accountId = 'wallet-1'
SET a.balance = 3`
      )
    })
  } catch (e) {
    console.log(e)
  }
}
const newTransaction = async (entries: any) => {
  try {
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      const doc: Record<string, string | number | Date> = {
        transactionId: uuidv4(),
        transactedAt: new Date(),
        entries,
      }
      await txn.execute("INSERT INTO transactions ?", doc)
    })
  } catch (e) {
    console.log(e)
  }
}
const getTransactionsWithAccount = async (accountId: string) => {
  try {
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      const results: dom.Value[] = (
        await txn.execute(
          "SELECT * FROM transactions AS t WHERE EXISTS (SELECT * FROM t.entries AS e WHERE e.accountId = ?)",
          accountId
        )
      ).getResultList()
      console.log(JSON.stringify(results, null, 2))
    })
  } catch (e) {
    console.log(e)
  }
}

const getAllEntriesForAccount = async (accountId: string) => {
  try {
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      const results: dom.Value[] = (
        await txn.execute(
          `SELECT e AS entry
          FROM transactions AS t,
          t.entries AS e
          WHERE e.accountId = ?`,
          accountId
        )
      ).getResultList()
      console.log(JSON.stringify(results, null, 2))
    })
  } catch (e) {
    console.log(e)
  }
}

const getAccountBalanceFromTransactions = async (accountId: string) => {
  try {
    await qldb.executeLambda(async (txn: TransactionExecutor) => {
      const results: dom.Value[] =
        // `SELECT totalCredit - totalDebit AS total, (SELECT SUM(e.amount) FROM e WHERE e.type = 'credit') AS totalCredit, (SELECT SUM(e.amount) FROM e WHERE e.type = 'debit') AS totalDebit,
        (
          await txn.execute(
            `SELECT SUM(e.amount) as total
          FROM transactions AS t,
          t.entries AS e
          WHERE e.accountId = ? AND e.type = 'credit'`,
            accountId
          )
        ).getResultList()
      const creditsTotal = results[0].total
      console.log(JSON.stringify(creditsTotal, null, 2))
      console.log(JSON.stringify(results, null, 2))
    })
  } catch (e) {
    console.log(e)
  }
}
// createTable()
const execute = async () => {
  // await createTable()
  // await listTables()
  // await createAccount("wallet-2")
  // await createAccount("wallet-3")
  // await listAccounts()
  await updateBalance("wallet-1", 3)
  // await newTransaction(entriesForTransfer2)
  // await newTransaction(entriesForTransfer2)
  // await newTransaction(entriesForTransfer1)
  await listAccounts()
  // await listTransactions()

  // await getTransactionsWithAccount("wallet-3")
  // await getAllEntriesForAccount("wallet-2")
  // await getAccountBalanceFromTransactions("wallet-2")
}

execute()
