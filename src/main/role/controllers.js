import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const roles = await prisma.Rol.findMany({
    select: {
      name: true,
    },
  });
  return res.json({ roles });
}
