import { QldbDriver, RetryConfig } from "amazon-qldb-driver-nodejs"
import { Agent } from "https"
import AWS from "aws-sdk"

const maxConcurrentTransactions: number = 10
const agentForQldb: Agent = new Agent({
  keepAlive: true,
  maxSockets: maxConcurrentTransactions,
})

const retryLimit: number = 4
// Use driver's default backoff function for this example (no second parameter provided to RetryConfig)
const retryConfig: RetryConfig = new RetryConfig(retryLimit)

const credentials = new AWS.SharedIniFileCredentials({
  profile: process.env.AWS_PROFILE,

  httpOptions: {
    agent: agentForQldb,
  },
})

AWS.config.credentials = credentials
const awsConfig = new AWS.Config({ region: "us-east-1" })

export const getQldbDriver = (ledgerName: string): QldbDriver => {
  return new QldbDriver(
    ledgerName,
    awsConfig,
    maxConcurrentTransactions,
    retryConfig
  )
}
