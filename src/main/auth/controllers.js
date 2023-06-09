import validator from "email-validator";
import { PrismaClient } from "@prisma/client";

import { generateLink } from "../../helpers/emails.js";
import {
  createUserWithToken,
  generateToken,
  saveTokenIntoDB,
  validateToken,
} from "../../helpers/token.js";
import { getName } from "../../helpers/usersname.js";
import { sendEmail } from "../outlook/emails.js";
import { getRolesFromUser, getUserById } from "../user/controllers.js";

const prisma = new PrismaClient();

export async function getUserInfo(req, res) {
  const { email } = req;
  try {
    if (!email) return res.status(401).json("Invalid token 1");
    const user = await getRolesFromUser(email);
    if (!user) return res.status(401).json("Invalid token 2");
    return res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred with credentials" });
  }
}

export async function getUserToken(req, res) {
  const { id } = req.params;
  try {
    const userToken = await prisma.User.findUnique({
      select: { token: true },
      where: { id: Number(id) },
    });
    return res.json({ userToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred with finding the token" });
  }
}

export async function signin(req, res) {
  const { email } = req.body;
  try {
    if (!email) return res.status(404).json("Please, fill all fields");
    const validatedEmail = validator.validate(email);
    if (!validatedEmail) return res.sendStatus(401).json("Invalid credentials");
    let user = await getRolesFromUser(email);
    if (!user) {
      const regex = /technipenergies.com$/;
      if (!regex.exec(email))
        return res
          .status(404)
          .json("Your email must belong to Technip Energies");
      const token = generateToken(email, "USER");
      const name = getName(email);
      const ok = await createUserWithToken({
        name: name,
        email: email,
        token: token,
      });
      if (ok) {
        // Agrega el código para asignar el rol de "USER" al usuario
        const userWithRole = await getRolesFromUser(email);
        const userRole = await prisma.Role.findUnique({
          where: { name: "USER" },
        });
        await prisma.UsersRole.create({
          data: { userId: userWithRole.id, roleId: userRole.id },
        });

        return res.json(`Email ${email} registered successfully`);
      } else throw new Error("Sending email failed");
    } else {
      return res.status(401).json(`Email ${email} already registered`);
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
}

export async function login(req, res) {
  const { email } = req.body;

  try {
    if (!email) return res.status(404).json("Please, fill all fields");

    const user = await getRolesFromUser(email);
    if (user) {
      const token = generateToken(email, user.roles);
      await saveTokenIntoDB({ email: email, token: token });
      const link = generateLink({ page: "log_in", id: user.id, token: token });
      const ok = await sendEmail({
        email: email,
        subject: "PitRequest: Log In",
        template: "login",
        link: link,
      });
      if (ok) {
        return res.json(`Email ${email} logged successfully`);
      } else throw new Error("Sending email failed");
    } else {
      return res.status(401).json(`Email ${email} doesn't exist`);
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
}

export async function validateCredentials(req, res) {
  const { user_id, token } = req.body;
  try {
    const user = await getUserById(Number(user_id));
    if (!user) return res.status(401).json("Link invalid");
    const validated = await validateToken({
      id: Number(user_id),
      token: token,
    });
    return !validated
      ? res.status(401).json("Invalid credentials")
      : res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while login" });
  }
}
