import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  const token2 = token.split("!").join(".");

  jwt.verify(token2, process.env.NODE_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    const { email } = user;

    // Verificar el token almacenado en la base de datos
    const userFromDB = await prisma.user.findUnique({
      where: { email },
    });

    if (userFromDB.token !== token) {
      return res.sendStatus(403);
    }

    req.email = email;
    req.roles = user.roles;
    next();
  });
}
