import express from "express";
import {
  getSelectedSoftware,
  getUnselectedSoftware,
  removeSoftwareFromProject,
} from "../software/controllers.js";
import {
  actionsAdmin,
  getAssignedAdmins,
  getUnassignedAdmins,
  removeAdmin,
} from "../user/controllers.js";
import {
  addSoftwareAndAdminToProject,
  createProject,
  deleteProject,
  getAll,
  getAllNames,
  getOneProject,
  getProjectTree,
  updateProject,
} from "./controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/name", getAllNames);
router.get("/tree", getProjectTree);
router.get("/:id", getOneProject);
router.get("/:id/softwares/:softwareId/admins/unassigned", getUnassignedAdmins);
router.get("/:id/softwares/:softwareId/admins/assigned", getAssignedAdmins);
router.get("/:id/softwares/unselected", getUnselectedSoftware);
router.get("/:id/softwares/selected", getSelectedSoftware);

router.post("/", createProject);
router.post("/softwares", addSoftwareAndAdminToProject);

router.put("/:id", updateProject);
router.put("/:projectId/softwares/:softwareId/admins/:adminId", actionsAdmin);

router.delete("/:id", deleteProject);
router.delete("/:id/softwares/:softwareId", removeSoftwareFromProject);
router.delete("/:projectId/softwares/:softwareId/admins/:adminId", removeAdmin);

export default router;
