import express from "express";
import { createCharter, deleteCharter, updateCharter } from "./controllers.js";

const router = express.Router();

router.post("/", createCharter);

router.put("/:id", updateCharter);

router.delete("/:id", deleteCharter);

export default router;
