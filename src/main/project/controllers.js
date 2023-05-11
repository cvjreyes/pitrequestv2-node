import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProjectTree(req, res) {
  const ProjectTree = await prisma.Project.findMany({
    include: {
      Charter: true,
      ProjectUsers: true,
      ProjectSoftwares: {
        include: {
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
  res.json(ProjectTree);
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
