import express from "express";
import {
  addSoftwareAdminProject,
  addUserProject,
  createProject,
  getProjectTree,
} from "./controllers.js";
import { createCharter } from "./charter/controllers.js";

const router = express.Router();

router.get("/get_tree", getProjectTree);

router.post("/create", createProject);
router.post("/create/charter", createCharter);
router.post("/add_user", addUserProject);
router.post("/add_software_admin", addSoftwareAdminProject);

export default router;
