import { Router } from "express";
import multer from "multer";
import {
  generateAudio,
  decrementCredits,
  downloadAudio,
} from "../../controllers/audio.controller.js";
import protect from "../../middleware/authMiddleware.js";

const router = Router();
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/x-m4a",
      "audio/mp4",
      "audio/aac",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only audio files (MP3, WAV, M4A) are allowed"));
    }
    cb(null, true);
  },
});

router.post("/generate", protect, upload.single("file"), generateAudio);

router.post("/deduct-credits", protect, decrementCredits);

export default router;
