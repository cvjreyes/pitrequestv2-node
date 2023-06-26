import { PrismaClient, RoleName, StatusName } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  await prisma.projectSoftwareTasks.deleteMany();
  await prisma.projectSoftwares.deleteMany();
  await prisma.charter.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.software.deleteMany();
  await prisma.project.deleteMany();
  await prisma.usersRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.status.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.ticketsAttachment.deleteMany();
  console.timeEnd("🧹 Cleaned up the database...");

  console.time("🌱 Created roles...");
  const roles = Object.keys(RoleName);
  await prisma.role.createMany({ data: roles });
  console.timeEnd("🌱 Created roles...");

  console.time("🌱 Created status...");
  const status = Object.keys(StatusName);
  await prisma.status.createMany({ data: status });
  console.timeEnd("🌱 Created status...");

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
