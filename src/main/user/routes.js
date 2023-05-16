import express from "express";
import { getAll, getUsersAdmins } from "./controllers.js";

const router = express.Router();

router.get("/get_all", getAll);
router.get("/get_admins", getUsersAdmins);

export default router;
