import { Router } from "express";
import passport from "passport";
import { clientController } from "../controllers";
import { authorize } from "../lib/auth";

const router = Router();
const jwt = passport.authenticate("jwt", { session: false });

router.get("/", jwt, authorize(["admin"]), clientController.getAllClients);

router.post("/get", jwt, authorize(["cliente", "admin"]), (req, res) =>
  clientController.getClientById(req, res),
);
router.post("/add", (req, res) => clientController.createClient(req, res));
router.post("/update", jwt, authorize(["admin", "cliente"]), (req, res) =>
  clientController.updateClient(req, res),
);
router.delete("/delete", jwt, authorize(["admin", "cliente"]), (req, res) =>
  clientController.deleteClient(req, res),
);

router.get("/festivals", jwt, authorize(["cliente", "admin"]), (req, res) =>
  clientController.getClientFestivals(req, res),
);

router.get("/ticket/:id", jwt, authorize(["cliente", "admin"]), (req, res) =>
  clientController.getTicketById(req, res),
);

export default router;
