import express from "express";
import { getUnselectedSoftware, removeSoftwareFromProject } from "../software/controllers.js";
import { changeAdmin, getUnassignedAdmins } from "../user/controllers.js";
import {
  addSoftwareAdminProject,
  addUserProject,
  createProject,
  deleteProject,
  getAdminAndSoftwareFromProject,
  getOneProject,
  getProjectTree,
  removeAdminSoftware,
  updateProject,
} from "./controllers.js";

const router = express.Router();

router.get("/tree", getProjectTree);
router.get("/:id", getOneProject);
router.get(
  "/:projectId/admins/:adminId/softwares/:softwareId",
  getAdminAndSoftwareFromProject
);
router.get("/:id/softwares/:softwareId/admins/unassigned", getUnassignedAdmins);
router.get("/:id/softwares/unselected", getUnselectedSoftware);

router.post("/", createProject);
router.post("/user", addUserProject);
router.post("/softwares", addSoftwareAdminProject);

router.put("/:id", updateProject);
router.put("/:projectId/softwares/:softwareId/admins/:adminId", changeAdmin);

router.delete("/:id", deleteProject);
router.delete("/admin/softwares/:id", removeAdminSoftware);
router.delete("/:id/softwares/:softwareId", removeSoftwareFromProject);

export default router;
