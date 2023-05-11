import express from "express";
import { createSoftware, deleteSoftware, getSoftwareTree } from "./controllers.js";
import { createTask, deleteTask } from "./task/controllers.js";
import { createSubTask, deleteSubtask } from "./subtask/controllers.js";

const router = express.Router();

router.get("/get_tree", getSoftwareTree);

router.post("/create", createSoftware);
router.post("/create/task", createTask);
router.post("/create/task/subtask", createSubTask);

router.delete("/delete/:id", deleteSoftware);
router.delete("/delete/task/:id", deleteTask);
router.delete("/delete/task/subtask/:id", deleteSubtask);

export default router;
