import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user) redirect("/sing-in");

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "USD",
      },
    });
  }

  //   Revalidate the homepage that uses the currency
  revalidatePath("/");
  return Response.json(userSettings);
}
