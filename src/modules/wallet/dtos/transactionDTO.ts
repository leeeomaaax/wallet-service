export interface TransactionDTO {
  type: "debt" | "credit"
  value: number
  description: string
}
