import express from "express";
import { createSubTask, deleteSubtask, updateSubTask } from "./controllers.js";

const router = express.Router();

router.post("/", createSubTask);

router.put("/:id", updateSubTask);

router.delete("/:id", deleteSubtask);

export default router;
