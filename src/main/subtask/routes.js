import express from "express";
import { createSubTask, deleteSubtask, getOneSubTask, updateSubTask } from "./controllers.js";

const router = express.Router();

router.get("/:id", getOneSubTask);

router.post("/", createSubTask);

router.put("/:id", updateSubTask);

router.delete("/:id", deleteSubtask);

export default router;
