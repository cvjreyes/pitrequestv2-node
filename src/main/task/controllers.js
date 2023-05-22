import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createTask(req, res) {
  const { name, softwareId } = req.body;
  try {
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
  try {
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
  try {
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
