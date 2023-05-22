import express from "express";
import cors from "cors";

import authRouter from "./src/main/auth/routes.js";

import userRouter from "./src/main/user/routes.js";
import roleRouter from "./src/main/role/routes.js";

import projectRouter from "./src/main/project/routes.js";
import charterRouter from "./src/main/charter/routes.js";

import softwareRouter from "./src/main/software/routes.js";
import taskRouter from "./src/main/task/routes.js";
import subtaskRouter from "./src/main/subtask/routes.js";

const app = express();

// Permitir solicitudes CORS desde cualquier origen
// Sirve para cambiar el 127.0.0.1 a localhost:5030 en el front end del react
app.use(cors());

// RECOGER INFORMACION BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTAS
app.use("/auth", authRouter);

app.use("/users", userRouter);
app.use("/roles", roleRouter);

app.use("/projects", projectRouter);
app.use("/charters", charterRouter);

app.use("/softwares", softwareRouter);
app.use("/tasks", taskRouter);
app.use("/subtasks", subtaskRouter);

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
