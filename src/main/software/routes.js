import express from "express";
import {
  createSoftware,
  deleteSoftware,
  updateSoftware,
  getAllSoftware,
  getSoftwareTree
} from "./controllers.js";

const router = express.Router();

router.get("/", getAllSoftware);
router.get("/tree", getSoftwareTree);

router.post("/", createSoftware);

router.put("/:id", updateSoftware);

router.delete("/:id", deleteSoftware);

export default router;



