import express from "express";
import { createSubTask, deleteSubtask } from "./controllers.js";

const router = express.Router();

router.post("/", createSubTask);

router.delete("/:id", deleteSubtask);

export default router;
