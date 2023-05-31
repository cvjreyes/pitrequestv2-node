import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllRoles(req, res) {
  const roles = await prisma.Role.findMany();
  return res.json({ roles });
}

export async function getRolesWithoutUser(req, res) {
  const roles = await prisma.Role.findMany({
    where: {
      NOT: {
        name: "USER",
      },
    },
  });
  return res.json({ roles });
}

export async function getUserRoles(req, res) {
  const { id } = req.params;
  const userRoles = await prisma.UsersRole.findMany({
    where: {
      userId: Number(id),
    },
    include: {
      role: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // Es para agrupar los roles dentro de un mismo objeto de user
  const groupedUserRoles = userRoles.reduce((acc, { user, role }) => {
    if (!acc[user.name]) {
      acc[user.name] = {
        user: { name: user.name },
        roles: [],
      };
    }
    acc[user.name].roles.push({ name: role.name });
    return acc;
  }, {});

  return res.json({ userRoles: Object.values(groupedUserRoles) });
}

export async function createRoles(req, res) {
  try {
    const newRoles = await prisma.Role.createMany({
      data: [{ name: "MATERIALS" }, { name: "ADMINTOOL" }],
    });

    return res.json({ newRoles });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Project" });
  }
}

export async function addRoleToUser(req, res) {
  const { userId, roleId } = req.body;
  try {
    const addRole = await prisma.UsersRole.createMany({
      data: {
        userId: Number(userId),
        roleId: Number(roleId),
      },
    });

    return res.json({ addRole });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the Role to the User" });
  }
}
