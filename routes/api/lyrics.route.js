import { Router } from "express";
import protect from "../../middleware/authMiddleware.js";
import {
  savelyrics,
  listLyrics,
  removeLyrics,
} from "../../controllers/savedLyrics.controller.js";

const router = Router();

router.get("/", protect, listLyrics);
router.post("/", protect, savelyrics);
router.delete("/:id", protect, removeLyrics);

export default router;
