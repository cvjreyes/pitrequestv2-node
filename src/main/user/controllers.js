import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const Users = await prisma.User.findMany();
  return res.json({ Users });
}
