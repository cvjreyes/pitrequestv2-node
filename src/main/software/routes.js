import express from "express";
import { createSoftware, getAll, getSoftwareTree } from "./controllers.js";
import { createSubTask, getAllSubTask } from "./subtask/controllers.js";
import { createTask, getAllTasks } from "./task/controllers.js";

const router = express.Router();

router.get("/get_all", getAll);
router.get("/get_tree", getSoftwareTree);
router.get("/get_all/tasks", getAllTasks);
router.get("/get_all/subtasks", getAllSubTask);

router.post("/create", createSoftware);
router.post("/create/task", createTask);
router.post("/create/task/subtask", createSubTask);

export default router;
