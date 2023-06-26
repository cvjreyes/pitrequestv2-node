import express from "express";
import { addRoleToUser } from "../role/controllers.js";
import {
  deleteUser,
  getAdmins,
  getAll,
  getAllProjectsAndRolesFromUsers,
  getProjectsAndRolesFromUser,
  updateProjectsAndRoles
} from "./controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/projects/roles", getAllProjectsAndRolesFromUsers);
router.get("/:id/projects/roles", getProjectsAndRolesFromUser);
router.get("/admins", getAdmins);

router.post("/:id/roles", addRoleToUser);

router.put("/projects/roles", updateProjectsAndRoles);

router.delete("/:id", deleteUser);

export default router;
