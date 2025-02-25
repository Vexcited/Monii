import { RepeatedTransaction, Transaction } from "@/types/transaction";
import { atom } from "jotai";

export const plans = atom<Array<RepeatedTransaction | Transaction>>([]);
