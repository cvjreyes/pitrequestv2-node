import express from "express";
import { createTask, deleteTask } from "./controllers.js";

const router = express.Router();

router.post("/", createTask);

router.delete("/:id", deleteTask);

export default router;
