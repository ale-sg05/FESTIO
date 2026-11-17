import { Router } from "express";
import passport from "passport";
import { authorize } from "../lib/auth";
import { logsController } from "../controllers/logs.controller";

const router = Router();
const jwt = passport.authenticate("jwt", { session: false });

router.get("/", jwt, authorize(["admin"]), (req, res) =>
  logsController.getLogs(req, res),
);

export default router;
