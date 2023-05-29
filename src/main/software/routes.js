import express from "express";
import {
  createSoftware,
  deleteSoftware,
  updateSoftware,
  getAllSoftware,
  getSoftwareTree,
  getOneSoftware
} from "./controllers.js";

const router = express.Router();

router.get("/", getAllSoftware);
router.get("/tree", getSoftwareTree);
router.get("/:id", getOneSoftware);

router.post("/", createSoftware);

router.put("/:id", updateSoftware);

router.delete("/:id", deleteSoftware);

export default router;



