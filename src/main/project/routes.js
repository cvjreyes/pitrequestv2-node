import express from "express";
import { createProject, getProjectTree } from "./controllers.js";

const router = express.Router();

router.get("/get_tree", getProjectTree);

router.post("/create", createProject);

export default router;
