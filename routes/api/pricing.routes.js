import { Router } from "express";
import getPricingConfig from "../../controllers/pricing.controller.js";

const router = Router();

router.get("/config", getPricingConfig);

export default router;
