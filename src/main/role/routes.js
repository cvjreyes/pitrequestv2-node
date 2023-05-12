import express from "express";
import { addRoleUser, createRoles, getAll, getUserRoles } from "./controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/user_roles/:id", getUserRoles);

router.post("/create_roles", createRoles);
router.post("/add_role_user", addRoleUser);

export default router;
