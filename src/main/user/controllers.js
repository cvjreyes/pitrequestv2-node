import { PrismaClient } from "@prisma/client";
import hasRoles from "../../helpers/auth.js";
import { generateToken, saveTokenIntoDB } from "../../helpers/token.js";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const Users = await prisma.User.findMany();
  return res.json({ Users });
}

export async function getUnassignedAdmins(req, res) {
  const { id, softwareId } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

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
        UsersRole: {
          some: {
            role: {
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
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    const Admins = await prisma.User.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        UsersRole: {
          some: {
            role: {
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

    const userRoles = await prisma.UsersRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });

    const roles = userRoles.map((userRole) => userRole.role.name);

    return { ...user, roles };
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllProjectsAndRolesFromUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        ProjectUsers: {
          select: {
            projectId: true,
            Project: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        UsersRole: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while getting the Users data table" });
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
        UsersRole: {
          select: {
            role: {
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
    const roles = user.UsersRole.map((userRole) => userRole.role);

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

  const userRoles = await prisma.UsersRole.findMany({
    where: { userId: id },
    include: { role: true },
  });

  const roles = userRoles.map((userRole) => userRole.role.name);

  return { ...getUserByID, roles };
}

export async function actionsAdmin(req, res) {
  const { softwareId, projectId, adminId } = req.params;
  const { newAdminId } = req.body;
  const { roles } = req;
  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    // Verificar si el software existe en el proyecto
    const existingSoftwareInProject = await prisma.ProjectSoftwares.findUnique({
      where: {
        projectId_adminId_softwareId: {
          projectId: Number(projectId),
          adminId: Number(adminId),
          softwareId: Number(softwareId),
        },
      },
    });
    if (!existingSoftwareInProject) {
      return res.status(400).json({
        error: "Software or Admin has been removed already from this project",
      });
    }

    const updatedSoftware = await prisma.ProjectSoftwares.update({
      data: {
        adminId: newAdminId ? Number(newAdminId) : null, // Convertir a número entero
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

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export async function updateProjectsAndRoles(req, res) {
  const { email, userId, projectIds, roleIds } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
      return res.sendStatus(401);

    // Verificar si el usuario existe
    const existingUser = await prisma.User.findUnique({
      where: { id: Number(userId) },
    });

    if (!existingUser) {
      return res.status(400).json({ error: "User has been deleted" });
    }

    // Verificar si se modificaron los roles
    const existingUserRoles = await prisma.UsersRole.findMany({
      where: { userId: Number(userId) },
      select: { roleId: true },
    });

    const existingRoleIds = existingUserRoles.map((userRole) => userRole.roleId);
    const isRoleModified = !arraysEqual(existingRoleIds, roleIds);

    await prisma.user.update({
      where: { id: userId },
      data: {
        ProjectUsers: {
          deleteMany: {},
          create: projectIds.map((projectId) => ({
            projectId,
          })),
        },
        UsersRole: {
          deleteMany: {
            NOT: {
              roleId: {
                in: 1,
              },
            },
          },
          create: roleIds.map((roleId) => ({
            roleId,
          })),
        },
      },
    });

    if (isRoleModified) {
      const user = await getRolesFromUser(email);
      const token = generateToken(email, user.roles);
      await saveTokenIntoDB({ email: email, token: token });
    }

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while updating user data" });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    // Verificar si el usuario existe
    const existingUser = await prisma.User.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(400).json({ error: "User already deleted" });
    }

    // Eliminar registros relacionados en la tabla `UsersRole`
    await prisma.UsersRole.deleteMany({
      where: {
        userId: Number(id),
      },
    });

    // Eliminar registros relacionados en la tabla `ProjectSoftwares`
    await prisma.ProjectSoftwares.deleteMany({
      where: {
        adminId: Number(id),
      },
    });

    // Eliminar registros relacionados en la tabla `ProjectUsers`
    await prisma.ProjectUsers.deleteMany({
      where: {
        userId: Number(id),
      },
    });

    // Finalmente, eliminar el usuario en la tabla `User`
    const deleteUser = await prisma.User.delete({
      where: { id: Number(id) },
    });

    return res.json({ deleteUser });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the User" });
  }
}
