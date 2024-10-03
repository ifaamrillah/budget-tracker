import { GetTransactionHistoryResponseType } from "@/app/api/transactions-history/route";

export type TransactionType = "income" | "expense";
export type Timeframe = "month" | "year";
export type Period = { year: number; month: number };
export type TransactionHistoryRow = GetTransactionHistoryResponseType[0];
