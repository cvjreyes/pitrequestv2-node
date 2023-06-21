import { PrismaClient } from "@prisma/client";
import hasRoles from "../../helpers/auth.js";

const prisma = new PrismaClient();

export async function getOneTask(req, res) {
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
      return res.sendStatus(401);
    const { id } = req.params;

    let tId = 0;

    if (id && !isNaN(Number(id))) {
      tId = Number(id);
    }

    const getTask = await prisma.Task.findUnique({
      where: { id: tId },
    });

    if (!getTask) return res.sendStatus(404)

    res.json(getTask);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while getting the Task" });
  }
}

export async function createTask(req, res) {
  const { name, softwareId } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    
    // Verificar si la software existe
    const existingSoftware = await prisma.Software.findUnique({
      where: { id: Number(softwareId) },
    });

    if (!existingSoftware) {
      return res.status(400).json({ error: "Software has been deleted" });
    }

    const newTask = await prisma.Task.create({
      data: {
        name,
        softwareId: Number(softwareId),
      },
    });
    return res.json({ newTask });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Task" });
  }
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    
    // Verificar si la software existe
    const existingTask = await prisma.Task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res.status(400).json({ error: "Task has been deleted" });
    }

    const newTask = await prisma.Task.update({
      data: {
        name,
      },
      where: { id: Number(id) },
    });
    return res.json({ newTask });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Task" });
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    // Verificar si la task existe
    const existingTask = await prisma.Task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res.status(400).json({ error: "Task already deleted" });
    }

    const deleteTask = await prisma.Task.delete({
      where: { id: Number(id) },
    });

    return res.json({ deleteTask });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Task" });
  }
}
