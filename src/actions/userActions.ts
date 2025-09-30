"use server";

import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

export async function createUser(data: FormData) {
  try {
    const parsedData = userSchema.parse({
      name: data.get("name"),
      email: data.get("email"),
    });

    const existedUser = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    });

    if (existedUser) {
      return { success: false, error: "Email already exists" };
    }

    await prisma.user.create({ data: parsedData });

    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Email already exists" };
      }
    }
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(id: string, data: FormData) {
  try {
    const parsedData = userSchema.parse({
      name: data.get("name"),
      email: data.get("email"),
    });

    const existedUser = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    });

    if (existedUser) {
      return { success: false, error: "Email already exists" };
    }

    await prisma.user.update({
      where: { id },
      data: parsedData,
    });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid ID or input data" };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Email already exists" };
      }
    }
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    const existedUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (existedUser) {
      return { success: false, error: "Please use correct data" };
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid ID" };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Email already exists" };
      }
    }
    return { success: false, error: "Failed to delete user" };
  }
}

export async function getUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
}

export async function getUserById(id: string) {
  try {
    const existedUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (existedUser) {
      return { success: false, error: "Please use correct data" };
    }

    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
}
