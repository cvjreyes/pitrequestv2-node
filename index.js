import cors from "cors";
import express from "express";

import authRouter from "./src/main/auth/routes.js";

import roleRouter from "./src/main/role/routes.js";
import userRouter from "./src/main/user/routes.js";

import charterRouter from "./src/main/charter/routes.js";
import projectRouter from "./src/main/project/routes.js";

import softwareRouter from "./src/main/software/routes.js";
import subtaskRouter from "./src/main/subtask/routes.js";
import taskRouter from "./src/main/task/routes.js";

import ticketRouter from "./src/main/ticket/routes.js";

import { checkAuth } from "./src/middlewares/auth.js";

import * as dotenv from "dotenv";

dotenv.config();

const app = express();

// Permitir solicitudes CORS desde cualquier origen
// Sirve para cambiar el 127.0.0.1 a localhost:5030 en el front end del react
app.use(cors());

// RECOGER INFORMACION BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTAS
app.use("/auth", authRouter);

app.use("/users", checkAuth, userRouter);
app.use("/roles", checkAuth, roleRouter);

app.use("/projects", checkAuth, projectRouter);
app.use("/charters", checkAuth, charterRouter);

app.use("/softwares", checkAuth, softwareRouter);
app.use("/tasks", checkAuth, taskRouter);
app.use("/subtasks", checkAuth, subtaskRouter);

app.use("/tickets", checkAuth, ticketRouter);

// 404 HANDLING
app.use("*", (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.error(
    `Someone with IP ${ip} tried to go to: ${req.baseUrl} but got sent an error`
  );
  res.status(500).send("Please, stop inventing");
});

app.listen(process.env.NODE_DB_PORT, () => {
  console.info(`Server is running on port: ${process.env.NODE_DB_PORT}`);
});
