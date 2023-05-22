import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const roles = await prisma.Rol.findMany({
    select: {
      name: true,
    },
    include:{
      roles: true
    }
  });
  return res.json({ roles });
}

export async function getUserRoles(req, res) {
  const { id } = req.params;
  const userRoles = await prisma.UsersRol.findMany({
    where: {
      userId: Number(id),
    },
    include: {
      rol: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  
  // Es para agrupar los roles dentro de un mismo objeto de user
  const groupedUserRoles = userRoles.reduce((acc, { user, rol }) => {
    if (!acc[user.name]) {
      acc[user.name] = {
        user: { name: user.name },
        roles: [],
      };
    }
    acc[user.name].roles.push({ name: rol.name });
    return acc;
  }, {});

  return res.json({ userRoles: Object.values(groupedUserRoles) });
}

export async function createRoles(req, res) {
  try {
    const newRoles = await prisma.Rol.createMany({
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
  const { userId, rolId } = req.body;
  try {
    const addRole = await prisma.UsersRol.createMany({
      data: {
        userId: Number(userId),
        rolId: Number(rolId),
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
