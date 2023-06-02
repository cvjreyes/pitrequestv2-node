import { PrismaClient } from "@prisma/client";
import hasRoles from "../../helpers/auth.js";

const prisma = new PrismaClient();

export async function getOneCharter(req, res) {
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
      return res.sendStatus(401);
    const { id } = req.params;

    let cId = 0;

    if (id && !isNaN(Number(id))) {
      cId = Number(id);
    }

    const getCharter = await prisma.Charter.findUnique({
      where: { id: cId },
    });

    res.json(getCharter);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while getting one Charter" });
  }
}

export async function createCharter(req, res) {
  const { name, projectId } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    const newCharter = await prisma.Charter.create({
      data: {
        name,
        projectId: Number(projectId),
      },
    });

    return res.json({ newCharter });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Charter" });
  }
}

export async function updateCharter(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    const newCharter = await prisma.Charter.update({
      data: {
        name,
      },
      where: { id: Number(id) },
    });

    return res.json({ newCharter });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Charter" });
  }
}

export async function deleteCharter(req, res) {
  const { id } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    const deleteCharter = await prisma.Charter.delete({
      where: { id: Number(id) },
    });

    return res.json({ deleteCharter });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Charter" });
  }
}
