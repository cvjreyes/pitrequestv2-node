import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';

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
        TicketsAttachment: { select: { id: true, url: true } },
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
  const { raisedBy, projectId, adminId, softwareId, subject, description } =
    req.body;

  const urlFiles = req.files.map((file) => ({ url: file.filename }));

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

    const allTickets = await prisma.Ticket.findMany();
    const lenghtTickets = allTickets.length;
    const ticketId = String(lenghtTickets + 1).padStart(6, "0");
    const ticketCode = `TIC${ticketId}`;

    const newTicket = await prisma.ticket.create({
      data: {
        code: ticketCode,
        raisedBy: Number(raisedBy),
        projectId: Number(projectId),
        softwareId: Number(softwareId),
        adminId: Number(adminId),
        subject,
        description,
        statusId: pendingStatus.id,
        TicketsAttachment: {
          createMany: {
            data: urlFiles,
          },
        },
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

export function downloadAttachment(req, res) {
  const { attachmentId } = req.params;

  // Obtener la ruta del archivo adjunto
  const filePath = path.join(__dirname, 'uploads', attachmentId);

  // Verificar si el archivo existe
  if (fs.existsSync(filePath)) {
    // Establecer las cabeceras de respuesta para la descarga
    res.setHeader('Content-Disposition', `attachment; filename=${attachmentId}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Crear un flujo de lectura para el archivo
    const fileStream = fs.createReadStream(filePath);

    // Transmitir el archivo al cliente
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
}