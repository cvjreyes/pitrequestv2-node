// import * as jwt from "jsonwebtoken";
import Jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

export function generateToken(email) {
  const token = Jwt.sign({ email }, process.env.NODE_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return token.split(".").join("!");
}

export async function createUserWithToken({ name, email, token }) {
  const newUser = await prisma.User.create({
    data: {
      name,
      email,
      token,
    },
  });
  return newUser;
}

export async function saveTokenIntoDB({ email, token }) {
  const tokenUpdated = await prisma.User.update({
    where: { email },
    data: { token },
  });
  return tokenUpdated;
}

export async function validateToken({ id, token }) {
  const result = await prisma.User.findUnique({
    where: { id },
  });
  if (!result) return false;
  const verifyToken = token.split("!").join(".");
  const test = Jwt.verify(verifyToken, process.env.NODE_TOKEN_SECRET, (err) => {
    if (err) return false;
    return true;
  });
  return test;
}
