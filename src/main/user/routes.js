import express from "express";
import { getAll } from "./controllers.js";

const router = express.Router();

router.get("/get_all", getAll);

export default router;