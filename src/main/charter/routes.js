import express from "express";
import { createCharter, deleteCharter } from "./controllers.js";

const router = express.Router();

router.post("/", createCharter);

router.delete("/:id", deleteCharter);

export default router;
