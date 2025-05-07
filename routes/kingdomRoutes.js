import express from "express";
import { listKingdoms, addKingdom } from "../controllers/kingdomController.js";

const router = express.Router();

router.get("/", listKingdoms);
router.post("/", addKingdom);

export default router;
