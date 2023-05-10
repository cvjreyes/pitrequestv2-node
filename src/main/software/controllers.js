import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const Softwares = await prisma.Software.findMany();
  return res.json({ Softwares });
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
