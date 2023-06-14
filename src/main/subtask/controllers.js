import { PrismaClient } from "@prisma/client";
import hasRoles from "../../helpers/auth.js";

const prisma = new PrismaClient();

export async function getOneSubTask(req, res) {
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINTOOL", "ADMINLEAD"]))
      return res.sendStatus(401);
    const { id } = req.params;

    let stId = 0;

    if (id && !isNaN(Number(id))) {
      stId = Number(id);
    }

    const getSubTask = await prisma.Subtask.findUnique({
      where: { id: stId },
    });

    res.json(getSubTask);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while getting the SubTask" });
  }
}

export async function createSubTask(req, res) {
  const { name, taskId } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);

    // Verificar si la task existe
    const existingTask = await prisma.Task.findUnique({
      where: { id: Number(taskId) },
    });

    if (!existingTask) {
      return res.status(400).json({ error: "Task has been deleted" });
    }

    const newSubtask = await prisma.Subtask.create({
      data: {
        name,
        taskId: Number(taskId),
      },
    });
    return res.json({ newSubtask });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the SubTask" });
  }
}

export async function updateSubTask(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    
    // Verificar si la subtask existe
    const existingSubtask = await prisma.Subtask.findUnique({
      where: { id: Number(id) },
    });

    if (!existingSubtask) {
      return res.status(400).json({ error: "Subtask has been deleted" });
    }

    const newSubtask = await prisma.Subtask.update({
      data: {
        name,
      },
      where: { id: Number(id) },
    });
    return res.json({ newSubtask });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the SubTask" });
  }
}

export async function deleteSubtask(req, res) {
  const { id } = req.params;
  const { roles } = req;

  try {
    if (!hasRoles(roles, ["ADMINLEAD"])) return res.sendStatus(401);
    
    // Verificar si la task existe
    const existingSubtask = await prisma.Subtask.findUnique({
      where: { id: Number(id) },
    });

    if (!existingSubtask) {
      return res.status(400).json({ error: "Subtask already deleted" });
    }

    const deleteSubtask = await prisma.Subtask.delete({
      where: { id: Number(id) },
    });

    return res.json({ deleteSubtask });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Subtask" });
  }
}
