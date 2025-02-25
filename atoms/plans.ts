import type { Transaction } from "@/types/transaction";
import { atomWithMMKV } from "@/utils/atomWithMMKV";

export const Plans = atomWithMMKV<Array<Transaction>>("planned_operations", []);
