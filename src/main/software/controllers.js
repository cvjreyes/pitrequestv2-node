import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAll(req, res) {
  const Softwares = await prisma.Software.findMany();
  return res.json({ Softwares });
}

export async function getSoftware(req, res) {
  const { id } = req.params;

  const Software = await prisma.Software.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      Task: {
        include: {
          Subtask: true,
        },
      },
    },
  });

  res.json(Software);
}

export async function createSoftware(req, res) {
  const { name, code, adminId } = req.body;
  console.log(name, code, adminId);
  try {
    const newSoftware = await prisma.Software.create({
      data: {
        name,
        code,
        adminId: Number(adminId),
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
