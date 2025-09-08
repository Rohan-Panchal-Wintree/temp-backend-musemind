import { Router } from "express";
import protect from "../../middleware/authMiddleware.js";

import {
  saveTrack,
  listTracks,
  removeTrack,
} from "../../controllers/savedTracks.controller.js";

const router = Router();

router.get("/", protect, listTracks);
router.post("/", protect, saveTrack);
router.delete("/:id", protect, removeTrack);

export default router;
