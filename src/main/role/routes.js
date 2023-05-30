import express from "express";
import { createRoles, getAllRoles } from "./controllers.js";

const router = express.Router();

router.get("/", getAllRoles);

router.post("/", createRoles);

export default router;

