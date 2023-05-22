import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllSoftware(req, res) {
  const getSoftwares = await prisma.Software.findMany();
  res.json(getSoftwares);
}

export async function getUnselectedSoftware(req, res) {
  const { id } = req.params;

  let pId = 0;

  if (id && !isNaN(parseInt(id))) {
    pId = parseInt(id);
  }
  // Obtener los IDs de los softwares seleccionados en el proyecto
  const selectedSoftwareIds = await prisma.ProjectSoftwares.findMany({
    where: { projectId: pId },
    select: { softwareId: true },
  });

  // Obtener todos los softwares que no están seleccionados en el proyecto
  const unselectedSoftwares = await prisma.Software.findMany({
    where: {
      NOT: { id: { in: selectedSoftwareIds.map((item) => item.softwareId) } },
    },
  });

  res.json(unselectedSoftwares);
}

export async function getSoftwareTree(req, res) {
  const SoftwareTree = await prisma.Software.findMany({
    include: {
      Task: {
        include: {
          Subtask: true,
        },
      },
    },
  });
  res.json(SoftwareTree);
}

export async function createSoftware(req, res) {
  const { name, code } = req.body;
  try {
    const newSoftware = await prisma.Software.create({
      data: {
        name,
        code,
      },
    });

    return res.json({ newSoftware });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Software" });
  }
}

export async function deleteSoftware(req, res) {
  const { id } = req.params;
  try {
    const deleteSoftware = await prisma.Software.delete({
      where: { id: Number(id) },
    });

    return res.json({ deleteSoftware });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Software" });
  }
}
