import { PrismaClient } from "@prisma/client";
import hasRoles from "../../helpers/auth.js";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
      return res.sendStatus(401);
    const Projects = await prisma.Project.findMany();
    return res.json({ Projects });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while getting the Projects" });
  }
}

export async function getProjectTree(req, res) {
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
      return res.sendStatus(401);
    const ProjectTree = await prisma.Project.findMany({
      include: {
        Charter: true,
        ProjectSoftwares: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            software: {
              include: {
                Task: {
                  include: {
                    Subtask: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const groupedProjectSoftwares = ProjectTree.reduce((acc, project) => {
      const softwares = project.ProjectSoftwares.reduce(
        (acc, projectSoftware) => {
          const key = projectSoftware.software.code;
          const existingSoftware = acc[key];

          if (!projectSoftware.user) {
            // Si no hay usuario (administrador), se crea una entrada en ProjectSoftwares sin usuarios
            if (existingSoftware) {
              return acc;
            }

            const newSoftware = {
              software: projectSoftware.software,
              users: [],
            };

            acc[key] = newSoftware;
            return acc;
          }

          if (existingSoftware) {
            existingSoftware.users.push(projectSoftware.user);
            return acc;
          }

          const newSoftware = {
            software: projectSoftware.software,
            users: [projectSoftware.user],
          };

          acc[key] = newSoftware;
          return acc;
        },
        {}
      );

      const newProject = {
        ...project,
        ProjectSoftwares: Object.values(softwares),
      };
      acc.push(newProject);
      return acc;
    }, []);
    res.json(groupedProjectSoftwares);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while getting the Projects Tree" });
  }
}

export async function getOneProject(req, res) {
  const { id } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
      return res.sendStatus(401);
    let pId = 0;

    if (id && !isNaN(Number(id))) {
      pId = Number(id);
    }

    const getProject = await prisma.Project.findUnique({
      where: { id: pId },
    });

    res.json(getProject);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while getting one Project" });
  }
}

// export async function getAdminAndSoftwareFromProject(req, res) {
//   const { roles } = req;

//   try {
//     if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
//       return res.sendStatus(401);
//     const { adminId, softwareId, projectId } = req.params;

//     let pId = 0;
//     let sId = 0;
//     let aId = 0;

//     if (projectId && !isNaN(parseInt(projectId))) {
//       pId = parseInt(projectId);
//     }
//     if (softwareId && !isNaN(parseInt(softwareId))) {
//       sId = parseInt(softwareId);
//     }
//     if (adminId && !isNaN(parseInt(adminId))) {
//       aId = parseInt(adminId);
//     }
//     const getAdminSoftwares = await prisma.ProjectSoftwares.findMany({
//       where: {
//         adminId: aId,
//         softwareId: sId,
//         projectId: pId,
//       },
//       select: { id: true },
//     });
//     res.json(getAdminSoftwares);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       error:
//         "An error occurred while getting an Admin and Software from Project",
//     });
//   }
// }

export async function createProject(req, res) {
  const { name, code, estimatedHours, userProjectId } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    const newProject = await prisma.Project.create({
      data: {
        name,
        code,
        estimatedHours: parseFloat(estimatedHours),
        userProjectId,
      },
    });

    const projectId = newProject.id;

    await prisma.ProjectUsers.create({
      data: {
        userId: userProjectId,
        projectId: projectId,
      },
    });

    return res.json({ newProject });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Project" });
  }
}

export async function addSoftwareAndAdminToProject(req, res) {
  const { projectId, adminId, softwareId } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    // Verificar si el project existe
    const existingProject = await prisma.Project.findUnique({
      where: { id: Number(projectId) },
    });

    // Verificar si el software existe
    const existingSoftware = await prisma.Software.findUnique({
      where: { id: Number(softwareId) },
    });

    // Verificar si el admin existe
    const existingUser = await prisma.User.findUnique({
      where: { id: Number(adminId) },
    });

    if (!existingProject) {
      return res.status(400).json({ error: "Project has been deleted" });
    } else if (!existingSoftware) {
      return res.status(400).json({ error: "Software has been deleted" });
    } else if (!existingUser) {
      return res.status(400).json({ error: "Admin has been removed" });
    }

    const newSoftwareProject = await prisma.ProjectSoftwares.create({
      data: {
        projectId: Number(projectId),
        adminId: Number(adminId),
        softwareId: Number(softwareId),
      },
    });

    // Verificar si el usuario ya está asignado al proyecto
    const existingProjectUser = await prisma.ProjectUsers.findFirst({
      where: {
        userId: Number(adminId),
        projectId: Number(projectId),
      },
    });

    // Si el usuario ya está asignado al proyecto, no hacer la inserción
    if (!existingProjectUser) {
      // Crear una nueva entrada en la tabla ProjectUsers
      await prisma.ProjectUsers.create({
        data: {
          userId: Number(adminId),
          projectId: Number(projectId),
        },
      });
    }

    return res.json({ newSoftwareProject });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "An error occurred while adding Software to the Project",
    });
  }
}

export async function updateProject(req, res) {
  const { id } = req.params;
  const { name, code, estimatedHours } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    
    // Verificar si el project existe
    const existingProject = await prisma.Project.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProject) {
      return res.status(400).json({ error: "Project has been deleted" });
    }

    const newProject = await prisma.Project.update({
      data: {
        name,
        code,
        estimatedHours: parseFloat(estimatedHours),
      },
      where: { id: Number(id) },
    });

    return res.json({ newProject });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Project" });
  }
}

export async function deleteProject(req, res) {
  const { id } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    
    // Verificar si el project existe
    const existingProject = await prisma.Project.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProject) {
      return res.status(400).json({ error: "Project already deleted" });
    }

    const deleteProject = await prisma.Project.delete({
      where: { id: Number(id) },
    });

    return res.json({ deleteProject });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Project" });
  }
}
