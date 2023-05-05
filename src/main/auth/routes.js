import express from "express";
import {
  getUserInfo,
  login,
  signin,
  validateCredentials,
} from "./controllers.js";
import { checkAuth } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/get_user_info", checkAuth, getUserInfo);

router.post("/signin", signin);
router.post("/validate_credentials", validateCredentials);

router.put("/login", login);

export default router;
