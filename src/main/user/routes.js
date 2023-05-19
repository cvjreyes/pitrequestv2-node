import express from "express";
import { getAll, getRolesFromUser, getAdmins } from "./controllers.js";
import { addRoleToUser } from "../role/controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id/roles", getRolesFromUser);
router.get("/admins", getAdmins);

router.post("/:id/roles", addRoleToUser);

export default router;



