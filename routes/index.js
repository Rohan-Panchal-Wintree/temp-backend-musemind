import { Router } from "express";
import authRoutes from "./api/auth.route.js";
import audioRoutes from "./api/audio.routes.js";
import savedTracksRoutes from "./api/savedTracks.route.js";
import lyricsRoutes from "./api/lyrics.route.js";
import pricingRouter from "./api/pricing.routes.js";
import paymentRouter from "./api/payments.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/audio", audioRoutes);
router.use("/savedTracks", savedTracksRoutes);
router.use("/lyrics", lyricsRoutes);
router.use("/pricing", pricingRouter);
router.use("/payment", paymentRouter);

export default router;
