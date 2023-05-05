import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser(email) {
  const getUserByEmail = await prisma.User.findUnique({
    where: { email },
  });
  return getUserByEmail;
}

export async function getUserById(id) {
  const getUserByID = await prisma.User.findUnique({
    where: { id },
  });
  return getUserByID;
}
