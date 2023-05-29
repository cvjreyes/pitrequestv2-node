import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const Users = await prisma.User.findMany();
  return res.json({ Users });
}

export async function getUnassignedAdmins(req, res) {
  try {
    const { id, softwareId } = req.params;

    let pId = 0;
    let sId = 0;

    if (id && !isNaN(parseInt(id))) {
      pId = parseInt(id);
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

export async function getAdmins(req, res) {
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

export async function getRolesFromUser(email) {
  try {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProjectsAndRolesFromUser(req, res) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        ProjectUsers: {
          select: {
            projectId: true, // Add this line to select the project ID
            Project: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        UsersRol: {
          select: {
            rol: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const projects = user.ProjectUsers.map(
      (projectUser) => projectUser.Project
    );
    const roles = user.UsersRol.map((userRol) => userRol.rol);

    return res.json({ projects, roles });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while getting the User Info" });
  }
}

export async function getUserById(id) {
  const getUserByID = await prisma.User.findUnique({
    where: { id },
  });

  if (!getUserByID) {
    return null;
  }

  const userRoles = await prisma.UsersRol.findMany({
    where: { userId: id },
    include: { rol: true },
  });

  const roles = userRoles.map((userRol) => userRol.rol.name);

  return { ...getUserByID, roles };
}

export async function changeAdmin(req, res) {
  const { softwareId, projectId, adminId } = req.params;
  const { newAdminId } = req.body;
  try {
    const updatedSoftware = await prisma.ProjectSoftwares.update({
      data: {
        adminId: Number(newAdminId), // Convertir a número entero
      },
      where: {
        projectId_adminId_softwareId: {
          projectId: Number(projectId),
          adminId: Number(adminId),
          softwareId: Number(softwareId),
        },
      },
    });

    return res.json({ updatedSoftware });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while editing the Software" });
  }
}
