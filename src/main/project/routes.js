import express from "express";
import {
  addSoftwareAdminProject,
  addUserProject,
  createProject,
  deleteProject,
  getAdminSoftwareProject,
  getProjectTree,
  removeAdminSoftware,
} from "./controllers.js";
import { createCharter, deleteCharter } from "./charter/controllers.js";

const router = express.Router();

router.get("/get_tree", getProjectTree);
router.get(
  "/get_admin_software/:adminId/:softwareId/:projectId",
  getAdminSoftwareProject
);

router.post("/create", createProject);
router.post("/create/charter", createCharter);
router.post("/add_user", addUserProject);
router.post("/add_software_admin", addSoftwareAdminProject);

router.delete("/delete/:id", deleteProject);
router.delete("/delete/charter/:id", deleteCharter);
router.delete("/remove/admin/software/:id", removeAdminSoftware);

export default router;
