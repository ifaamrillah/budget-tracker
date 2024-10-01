import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { GetFormatterForCurrency } from "@/lib/helper";
import { OverviewQuerySchema } from "../../../../schema/overview";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await getTransactionHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(transactions);
}

async function getTransactionHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) throw new Error("user settings not found");

  const formatter = GetFormatterForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    // let format the amount with the user currency
    formattedAmount: formatter.format(transaction.amount),
  }));
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionHistory>
>;
