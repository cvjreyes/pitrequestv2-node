import express from "express";
import {
  getAll,
  getRolesFromUser,
  getAdmins,
  getProjectsAndRolesFromUser,
  getAllProjectsAndRolesFromUsers,
  addProjectsAndRoles,
} from "./controllers.js";
import { addRoleToUser } from "../role/controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/projects/roles", getAllProjectsAndRolesFromUsers);
router.get("/:id/roles", getRolesFromUser);
router.get("/:id/projects/roles", getProjectsAndRolesFromUser);
router.get("/admins", getAdmins);

router.post("/projects/roles", addProjectsAndRoles);
router.post("/:id/roles", addRoleToUser);


export default router;
