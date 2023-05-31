import express from "express";
import {
  getAll,
  getRolesFromUser,
  getAdmins,
  getProjectsAndRolesFromUser,
  getAllProjectsAndRolesFromUsers,
  updateProjectsAndRoles,
} from "./controllers.js";
import { addRoleToUser } from "../role/controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/projects/roles", getAllProjectsAndRolesFromUsers);
router.get("/:id/roles", getRolesFromUser);
router.get("/:id/projects/roles", getProjectsAndRolesFromUser);
router.get("/admins", getAdmins);

router.post("/:id/roles", addRoleToUser);

router.put("/projects/roles", updateProjectsAndRoles);

export default router;
