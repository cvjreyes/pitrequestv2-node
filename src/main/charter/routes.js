import express from "express";
import {
  createCharter,
  deleteCharter,
  getChartersFromProject,
  getOneCharter,
  updateCharter,
} from "./controllers.js";

const router = express.Router();

router.get("/:id", getOneCharter);
router.get("/project/:projectId", getChartersFromProject);

router.post("/", createCharter);

router.put("/:id", updateCharter);

router.delete("/:id", deleteCharter);

export default router;
