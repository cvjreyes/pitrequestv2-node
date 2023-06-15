import express from "express";
import { createTicket, getTickets } from "./controllers.js";
import multerUpload from "../../middlewares/multer.js";

const router = express.Router();

router.get("/", getTickets);

router.post("/", multerUpload.array("tickets") ,createTicket);

export default router;
