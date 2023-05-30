import express from "express";
import { getUnselectedSoftware, removeSoftwareFromProject } from "../software/controllers.js";
import { changeAdmin, getUnassignedAdmins } from "../user/controllers.js";
import {
  addSoftwareAndAdminToProject,
  createProject,
  deleteProject,
  getAdminAndSoftwareFromProject,
  getAll,
  getOneProject,
  getProjectTree,
  removeAdminSoftware,
  updateProject
} from "./controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/tree", getProjectTree);
router.get("/:id", getOneProject);
router.get(
  "/:projectId/admins/:adminId/softwares/:softwareId",
  getAdminAndSoftwareFromProject
);
router.get("/:id/softwares/:softwareId/admins/unassigned", getUnassignedAdmins);
router.get("/:id/softwares/unselected", getUnselectedSoftware);

router.post("/", createProject);
router.post("/softwares", addSoftwareAndAdminToProject);

router.put("/:id", updateProject);
router.put("/admin/softwares/:id", removeAdminSoftware);
router.put("/:projectId/softwares/:softwareId/admins/:adminId", changeAdmin);

router.delete("/:id", deleteProject);
router.delete("/:id/softwares/:softwareId", removeSoftwareFromProject);

export default router;
