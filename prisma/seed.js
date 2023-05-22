import { PrismaClient, RolName } from "@prisma/client";

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
  await prisma.usersRol.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.user.deleteMany();
  console.timeEnd("🧹 Cleaned up the database...");

  console.time("🌱 Created roles...");
  const roles = Object.keys(RolName);
  await prisma.rol.createMany({ data: roles });
  console.timeEnd("🌱 Created roles...");

  console.time("🌱 Created user and token...");
  const user = await prisma.user.create({
    data: {
      name: "Sean Saez Fuller",
      email: "sean.saez-fuller@technipenergies.com",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9!eyJlbWFpbCI6InNlYW4uc2Flei1mdWxsZXJAdGVjaG5pcGVuZXJnaWVzLmNvbSIsInJvbGVzIjpbIk1BVEVSSUFMUyIsIkFETUlOVE9PTCJdLCJpYXQiOjE2ODQ0OTQyNzMsImV4cCI6MTY4NTA5OTA3M30!xUJgLd9M9pS2mT83u9TNbEurHcsCgYKO8MxbuwsaDUE", // Replace with your preferred token generation logic
      UsersRol: {
        connect: {},
      },
    },
  });
  console.timeEnd("🌱 Created user and token...");

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
