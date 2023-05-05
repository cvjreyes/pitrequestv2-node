import express from "express";
import { createSoftware, getAll, getSoftware } from "./controllers.js";
import { createTask, getAllTask } from "./task/controllers.js";
import { createSubTask, getAllSubTask } from "./subtask/controllers.js";

const router = express.Router();

router.get("/get_all", getAll)
router.get("/get_all/:id", getSoftware)
router.get("/get_all/task/:softwareId", getAllTask)
router.get("/get_all/subtask/:taskId", getAllSubTask)

router.post("/create", createSoftware)
router.post("/create/task", createTask)
router.post("/create/task/subtask", createSubTask)


export default router;