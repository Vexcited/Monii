export type Transaction = {
  label: string
  amount: number
  currency: string
  timestamp: number
}

export type RepeatedTransaction = Transaction & {
  every: "month"
}
