import { z } from "zod";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(req.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["expense", "income"]).nullable();
  const queryParams = validator.safeParse(paramType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // include type in the filters if it's defined
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(categories);
}
