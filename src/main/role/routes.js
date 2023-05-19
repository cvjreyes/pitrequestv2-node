import express from "express";
import { createRoles, getAll } from "./controllers.js";

const router = express.Router();

router.get("/", getAll);

router.post("/", createRoles);

export default router;

