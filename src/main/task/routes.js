import express from "express";
import {
    createTask,
    deleteTask,
    getOneTask,
    updateTask,
} from "./controllers.js";

const router = express.Router();

router.get("/:id", getOneTask);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;
