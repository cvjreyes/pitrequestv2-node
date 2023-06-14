import express from "express";
import { createTicket, getTickets } from "./controllers.js";

const router = express.Router();

router.get("/", getTickets);

router.post("/", createTicket);

export default router;
