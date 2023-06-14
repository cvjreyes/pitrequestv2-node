import express from "express";
import {
  createRoles,
  getAllRoles,
  getRolesWithoutUser,
} from "./controllers.js";

const router = express.Router();

router.get("/", getAllRoles);
router.get("/noUser", getRolesWithoutUser);

router.post("/", createRoles);

export default router;
