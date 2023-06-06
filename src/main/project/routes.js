import express from "express";
import { getUnselectedSoftware, removeSoftwareFromProject } from "../software/controllers.js";
import { actionsAdmin, getUnassignedAdmins } from "../user/controllers.js";
import {
  addSoftwareAndAdminToProject,
  createProject,
  deleteProject,
  // getAdminAndSoftwareFromProject,
  getAll,
  getOneProject,
  getProjectTree,
  updateProject
} from "./controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/tree", getProjectTree);
router.get("/:id", getOneProject);
// router.get(
//   "/:projectId/admins/:adminId/softwares/:softwareId",
//   getAdminAndSoftwareFromProject
// );
router.get("/:id/softwares/:softwareId/admins/unassigned", getUnassignedAdmins);
router.get("/:id/softwares/unselected", getUnselectedSoftware);

router.post("/", createProject);
router.post("/softwares", addSoftwareAndAdminToProject);

router.put("/:id", updateProject);
router.put("/:projectId/softwares/:softwareId/admins/:adminId", actionsAdmin);

router.delete("/:id", deleteProject);
router.delete("/:id/softwares/:softwareId", removeSoftwareFromProject);

export default router;
