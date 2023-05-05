import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllSubTask(req, res) {
  const { taskId } = req.params;
  const Subtasks = await prisma.Subtask.findMany({
    where: { taskId: Number(taskId) },
  });
  return res.json({ Subtasks });
}

export async function createSubTask(req, res) {
  const { name, taskId } = req.body;
  try {
    const newSubtask = await prisma.Subtask.create({
      data: {
        name,
        taskId,
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
