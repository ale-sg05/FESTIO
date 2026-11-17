import { Router } from "express";
import { paymentController } from "../controllers/";
import { authorize } from "../lib/auth";
import passport from "passport";

const router = Router();
const jwt = passport.authenticate("jwt", { session: false });

router.post("/buy", jwt, authorize(["cliente"]), (req, res) =>
  paymentController.buyTicket(req, res),
);

router.post("/recharge", jwt, authorize(["cliente"]), (req, res) =>
  paymentController.rechargeAbono(req, res),
);

router.post("/refund", jwt, authorize(["cliente"]), (req, res) =>
  paymentController.refundAbono(req, res),
);

export default router;
