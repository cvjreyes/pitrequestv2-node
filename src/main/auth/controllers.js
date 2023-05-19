import validator from "email-validator";

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

export async function signin(req, res) {
  const { email } = req.body;
  try {
    if (!email) return res.status(404).json("Please, fill all fields");
    const validatedEmail = validator.validate(email);
    if (!validatedEmail) return res.status(401).json("Invalid credentials");
    let user = await getRolesFromUser(email);
    if (!user) {
      const regex = /technipenergies.com$/;
      if (!regex.exec(email))
        return res
          .status(401)
          .json("Your email must belong to Technip Energies");
      const token = generateToken(email, user.roles);
      const name = getName(email);
      const ok = await createUserWithToken({
        name: name,
        email: email,
        token: token,
      });
      if (ok) {
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
        return res.json(`Email ${email} registered successfully`);
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
