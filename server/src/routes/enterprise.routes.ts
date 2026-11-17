import { Router } from "express";
import { enterpriseController } from "../controllers/";

import { authorize } from "../lib/auth";
import passport from "passport";

const router = Router();
const jwt = passport.authenticate("jwt", { session: false });

router.get("/", jwt, authorize(["admin"]), (req, res) =>
  enterpriseController.getAllEnterprises(req, res),
);

router.get("/:id", jwt, authorize(["admin", "empresa"]), (req, res) =>
  enterpriseController.getEnterpriseById(req, res),
);

router.put("/add", (req, res) =>
  enterpriseController.createEnterprise(req, res),
);

router.post("/update", jwt, authorize(["empresa", "admin"]), (req, res) =>
  enterpriseController.updateEnterprise(req, res),
);

router.delete("/delete", jwt, authorize(["empresa", "admin"]), (req, res) =>
  enterpriseController.deleteEnterprise(req, res),
);

router.post("/restrict", jwt, authorize(["admin"]), (req, res) =>
  enterpriseController.restrictEnterprise(req, res),
);

router.post("/verify", jwt, authorize(["admin"]), (req, res) =>
  enterpriseController.verifyEnterprise(req, res),
);

router.get("/:id/dashboard", jwt, authorize(["admin", "empresa"]), (req, res) =>
  enterpriseController.getEnterpriseDashboard(req, res),
);

export default router;
