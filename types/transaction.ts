export type Transaction = {
  label: string
  amount: number
  currency: string
  // timestamp: number
  /**
   * Here are some examples.
   * - `01` = day for monthly repeat
   * - `01-12` = day + month for yearly repeat
   * - `01-12-2022` = no repeat
   */
  date: string
}
