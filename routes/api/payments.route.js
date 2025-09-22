import { Router } from "express";
import protect from "../../middleware/authMiddleware.js";
import {
  initPayment,
  forwardPayment,
} from "../../controllers/payments.controller.js";

const router = Router();

router.post("/init", protect, initPayment);

// Browser hits this to auto-submit the form to the gateway
// router.get("/forward/:orderItemId", forwardPayment);
router.post("/forward/:orderItemId", forwardPayment);

export default router;
