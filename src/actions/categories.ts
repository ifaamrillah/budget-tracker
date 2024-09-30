"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "../../schema/categories";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) throw new Error("Bad request");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { name, icon, type } = parsedBody.data;

  const createCategory = await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });

  return createCategory;
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) throw new Error("Bad request");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const categories = await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });

  return categories;
}
