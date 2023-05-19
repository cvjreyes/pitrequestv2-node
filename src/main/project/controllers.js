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

export async function getAdminAndSoftwareFromProject(req, res) {
  const { adminId, softwareId, projectId } = req.params;

  let pId = 0;
  let sId = 0;
  let aId = 0;

  if (projectId && !isNaN(parseInt(projectId))) {
    pId = parseInt(projectId);
  }
  if (softwareId && !isNaN(parseInt(softwareId))) {
    sId = parseInt(softwareId);
  }
  if (adminId && !isNaN(parseInt(adminId))) {
    aId = parseInt(adminId);
  }
  const getAdminSoftwares = await prisma.ProjectSoftwares.findMany({
    where: {
      adminId: aId,
      softwareId: sId,
      projectId: pId,
    },
    select: { id: true },
  });
  res.json(getAdminSoftwares);
}

export async function createProject(req, res) {
  const { name, code, estimatedHours, userProjectId } = req.body;
  try {
    const newProject = await prisma.Project.create({
      data: {
        name,
        code,
        estimatedHours: parseFloat(estimatedHours),
        userProjectId,
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
    const newSoftwareProject = await prisma.ProjectSoftwares.create({
      data: {
        projectId: Number(projectId),
        adminId: Number(adminId),
        softwareId: Number(softwareId),
      },
    });

    return res.json({ newSoftwareProject });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "An error occurred while adding Software to the Project",
    });
  }
}

// Tengo que hacer el unchecked project task de software

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
