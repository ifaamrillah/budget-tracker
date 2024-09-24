import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SquareArrowDown, SquareArrowUp } from "lucide-react";

import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";

export default async function page() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) redirect("/wizard");

  return (
    <div className="h-full bg-background px-4 md:px-0">
      <div className="border-b bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8 px-4 md:px-0">
          <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-emerald-500 bg-emerald-700 text-white hover:bg-emerald-900 hover:text-white"
                >
                  <span className="mr-2">New Income</span>
                  <SquareArrowDown className="h-5 w-5" />
                </Button>
              }
              type="income"
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-rose-500 bg-rose-700 text-white hover:bg-rose-900 hover:text-white"
                >
                  <span className="mr-2">New Expense</span>
                  <SquareArrowUp className="h-5 w-5" />
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
    </div>
  );
}
