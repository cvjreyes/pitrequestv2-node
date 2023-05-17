import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const Users = await prisma.User.findMany();
  return res.json({ Users });
}

export async function getUnassignedAdmins(req, res) {
  try {
    const { projectId, softwareId } = req.params;

    let pId = 0;
    let sId = 0;

    if (projectId && !isNaN(parseInt(projectId))) {
      pId = parseInt(projectId);
    }
    if (softwareId && !isNaN(parseInt(softwareId))) {
      sId = parseInt(softwareId);
    }

    const admins = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        UsersRol: {
          some: {
            rol: {
              name: "ADMINTOOL",
            },
          },
        },
        NOT: {
          ProjectSoftwares: {
            some: {
              projectId: pId,
              softwareId: sId,
            },
          },
        },
      },
    });

    return res.json({ admins });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUsersAdmins(req, res) {
  try {
    const Admins = await prisma.User.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        UsersRol: {
          some: {
            rol: {
              name: "ADMINTOOL",
            },
          },
        },
      },
    });

    return res.json({ Admins });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
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
