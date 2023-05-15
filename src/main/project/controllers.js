import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProjectTree(req, res) {
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

  // Esto es para juntar los usuarios que hay en cada software dentro del objeto ProjectSoftwares
  const groupedProjectSoftwares = ProjectTree.reduce((acc, project) => {
    const softwares = project.ProjectSoftwares.reduce(
      (acc, projectSoftware) => {
        const key = projectSoftware.software.code;
        const existingSoftware = acc[key];

        if (!projectSoftware.user) {
          return acc; // Si el usuario es nulo, salta este ciclo de reduce.
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
}

export async function getAdminSoftwareProject(req, res) {
  const { adminId, softwareId, projectId } = req.params;
  const getAdminSoftwares = await prisma.ProjectSoftwares.findMany({
    where: {
      adminId: Number(adminId),
      softwareId: Number(softwareId),
      projectId: Number(projectId),
    },
    select: { id: true },
  });
  res.json(getAdminSoftwares);
}

export async function createProject(req, res) {
  const { name, code, estimatedHours } = req.body;
  try {
    const newProject = await prisma.Project.create({
      data: {
        name,
        code,
        estimatedHours: parseFloat(estimatedHours),
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

export async function addUserProject(req, res) {
  const { projectId, userId } = req.body;
  try {
    const newProjectUser = await prisma.ProjectUsers.create({
      data: {
        projectId: Number(projectId),
        userId: Number(userId),
      },
    });

    return res.json({ newProjectUser });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Project" });
  }
}

export async function addSoftwareAdminProject(req, res) {
  const { projectId, adminId, softwareId } = req.body;
  try {
    let newSoftwareProject;
    if (adminId) {
      newSoftwareProject = await prisma.ProjectSoftwares.create({
        data: {
          projectId: Number(projectId),
          adminId: Number(adminId),
          softwareId: Number(softwareId),
        },
      });
    } else {
      newSoftwareProject = await prisma.ProjectSoftwares.create({
        data: {
          projectId: Number(projectId),
          softwareId: Number(softwareId),
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

export async function deleteProject(req, res) {
  const { id } = req.params;
  try {
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

export async function removeAdminSoftware(req, res) {
  const { id } = req.params;
  try {
    const removeAdminSoftware = await prisma.ProjectSoftwares.delete({
      where: { id: Number(id) },
    });

    return res.json({ removeAdminSoftware });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Project" });
  }
}
