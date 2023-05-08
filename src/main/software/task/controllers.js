import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllTasks(req, res) {
  const Tasks = await prisma.Task.findMany();
  return res.json({ Tasks });
}

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
