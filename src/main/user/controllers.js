import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const Users = await prisma.User.findMany();
  return res.json({ Users });
}

export async function getUserWithRoles(email) {
  const user = await prisma.User.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const userRoles = await prisma.UsersRol.findMany({
    where: { userId: user.id },
    include: { rol: true },
  });

  const roles = userRoles.map((userRol) => userRol.rol.name);

  return { ...user, roles };
}

export async function getUserById(id) {
  const getUserByID = await prisma.User.findUnique({
    where: { id },
  });
  return getUserByID;
}
