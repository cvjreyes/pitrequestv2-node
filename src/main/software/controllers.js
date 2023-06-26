import { PrismaClient } from "@prisma/client";
import hasRoles from "../../helpers/auth.js";

const prisma = new PrismaClient();

export async function getAllSoftware(req, res) {
  const getSoftwares = await prisma.Software.findMany();
  res.json(getSoftwares);
}

export async function getOneSoftware(req, res) {
  const { id } = req.params;

  let sId = 0;

  if (id && !isNaN(Number(id))) {
    sId = Number(id);
  }

  const getSoftware = await prisma.Software.findUnique({
    where: { id: sId },
  });

  if (!getSoftware) return res.sendStatus(404);

  res.json(getSoftware);
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

export async function getSelectedSoftware(req, res) {
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
    where: { id: { in: selectedSoftwareIds.map((item) => item.softwareId) } },
  });

  res.json(unselectedSoftwares);
}

export async function getSoftwareTree(req, res) {
  const { roles } = req;
  try {
    if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
      return res.sendStatus(401);

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
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function createSoftware(req, res) {
  const { name, code } = req.body;
  const { roles } = req;
  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    const findName = await prisma.Software.findUnique({
      where: {
        name,
      },
    });
    const findCode = await prisma.Software.findUnique({
      where: {
        code,
      },
    });

    if (findName || findCode)
      return res
        .status(400)
        .json({ error: "The name or code of the Software already exist" });

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

export async function updateSoftware(req, res) {
  const { id } = req.params;
  const { name, code } = req.body;
  const { roles } = req;
  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    // Verificar si la software existe
    const existingSoftware = await prisma.Software.findUnique({
      where: { id: Number(id) },
    });

    if (!existingSoftware) {
      return res.status(400).json({ error: "Software has been deleted" });
    }

    if (!name && !code)
      return res
        .status(400)
        .json({ error: "The Name and Code of the Software not changed" });

    if (name && !code) {
      const findName = await prisma.Software.findUnique({
        where: {
          name,
        },
      });
      if (findName)
        return res
          .status(400)
          .json({ error: "The Name of the Software already exist" });

      const newSoftware = await prisma.Software.update({
        data: {
          name,
        },
        where: { id: Number(id) },
      });

      return res.json({ newSoftware });
    }

    if (code && !name) {
      const findCode = await prisma.Software.findUnique({
        where: {
          code,
        },
      });
      if (findCode)
        return res
          .status(400)
          .json({ error: "The Code of the Software already exist" });
      const newSoftware = await prisma.Software.update({
        data: {
          code,
        },
        where: { id: Number(id) },
      });
      return res.json({ newSoftware });
    }

    const newSoftware = await prisma.Software.update({
      data: {
        name,
        code,
      },
      where: { id: Number(id) },
    });

    return res.json({ newSoftware });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while editing the Software" });
  }
}

export async function deleteSoftware(req, res) {
  const { id } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    // Verificar si el software existe
    const existingSoftware = await prisma.Software.findUnique({
      where: { id: Number(id) },
    });

    if (!existingSoftware) {
      return res.status(400).json({ error: "Software already deleted" });
    }

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

export async function removeSoftwareFromProject(req, res) {
  const { id, softwareId } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    // Verificar si el software existe
    const existingSoftware = await prisma.Software.findUnique({
      where: { id: Number(softwareId) },
    });

    // Verificar si el project existe
    const existingProject = await prisma.Project.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProject) {
      return res.status(400).json({ error: "Project has been deleted" });
    } else if (!existingSoftware) {
      return res.status(400).json({ error: "Software has been deleted" });
    }

    const removeSoftware = await prisma.ProjectSoftwares.deleteMany({
      where: { projectId: Number(id), softwareId: Number(softwareId) },
    });

    return res.json({ removeSoftware });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Software" });
  }
}
