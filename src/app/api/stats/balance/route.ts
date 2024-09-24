import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { OverviewQuerySchema } from "../../../../../schema/overview";

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((total) => total.type === "expense")?._sum.amount || 0,
    income: totals.find((total) => total.type === "income")?._sum.amount || 0,
  };
}

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;
