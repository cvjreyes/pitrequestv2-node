import express from "express";
import { getAll, getUnassignedAdmins, getUsersAdmins } from "./controllers.js";

const router = express.Router();

router.get("/get_all", getAll);
router.get("/get_admins", getUsersAdmins);
router.get("/get_unassigned_admins/:projectId/:softwareId", getUnassignedAdmins);

export default router;
