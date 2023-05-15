import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createCharter(req, res) {
  const { name, projectId } = req.body;
  try {
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

export async function deleteCharter(req, res) {
  const { id } = req.params;
  try {
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