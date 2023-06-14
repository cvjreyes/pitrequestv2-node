import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTickets(req, res) {
  try {
    const tickets = await prisma.Ticket.findMany({
      select: {
        id: true,
        code: true,
        subject: true,
        description: true,
        created_at: true,
        updated_at: true,
        Project: { select: { code: true, name: true } },
        Software: { select: { code: true, name: true } },
        User: { select: { name: true } },
        Admin: { select: { name: true } },
        Status: { select: { name: true } },
      },
    });

    res.json(tickets);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while getting the Ticket" });
  }
}

export async function createTicket(req, res) {
  const {
    code,
    raisedBy,
    projectId,
    adminId,
    softwareId,
    subject,
    description,
  } = req.body;

  try {
    // Verificar si el project existe
    const existingProject = await prisma.Project.findUnique({
      where: { id: Number(projectId) },
    });

    // Verificar si el software existe
    const existingSoftware = await prisma.Software.findUnique({
      where: { id: Number(softwareId) },
    });

    // Verificar si el user existe
    const existingUser = await prisma.User.findUnique({
      where: { id: Number(raisedBy) },
    });

    // Verificar si el admin existe
    const existingAdmin = await prisma.User.findUnique({
      where: { id: Number(adminId) },
    });

    // Verificar si el software existe en el proyecto
    const existingSoftwareAndAdminInProject =
      await prisma.ProjectSoftwares.findUnique({
        where: {
          projectId_adminId_softwareId: {
            projectId: Number(projectId),
            adminId: Number(adminId),
            softwareId: Number(softwareId),
          },
        },
      });

    if (!existingProject) {
      return res.status(400).json({ error: "Project has been deleted" });
    } else if (!existingSoftware) {
      return res.status(400).json({ error: "Software has been deleted" });
    } else if (!existingUser) {
      return res.status(400).json({ error: "User has been deleted" });
    } else if (!existingAdmin) {
      return res.status(400).json({ error: "Admin has been deleted" });
    } else if (!existingSoftwareAndAdminInProject) {
      return res
        .status(400)
        .json({ error: "Admin and Software are not from same Project" });
    }

    // Obtener la ID del estado "PENDING" desde la tabla Status
    const pendingStatus = await prisma.Status.findFirst({
      where: {
        name: "PENDING",
      },
    });

    const newTicket = await prisma.Ticket.create({
      data: {
        code,
        raisedBy: Number(raisedBy),
        projectId: Number(projectId),
        softwareId: Number(softwareId),
        adminId: Number(adminId),
        subject,
        description,
        statusId: pendingStatus.id,
      },
    });

    return res.json({ newTicket });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "An error occurred while creating a new ticket",
    });
  }
}
