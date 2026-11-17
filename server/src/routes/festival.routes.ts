import { Router } from "express";
import { festivalController } from "../controllers/";
import passport from "passport";
import { authorize } from "../lib/auth";

import festivalRoutes from "./payment.routes";

const router = Router();
const jwt = passport.authenticate("jwt", { session: false });

router.get("/images", (req, res) =>
  festivalController.getFestivalImages(req, res),
);

router.get("/", (req, res) => festivalController.getAllFestivals(req, res));
router.get("/:id", (req, res) => festivalController.getFestivalById(req, res));

router.post("/add", jwt, authorize(["empresa"]), (req, res) =>
  festivalController.createFestival(req, res),
);

router.post("/update", jwt, authorize(["empresa", "admin"]), (req, res) =>
  festivalController.updateFestival(req, res),
);

router.delete("/delete", jwt, authorize(["empresa", "admin"]), (req, res) =>
  festivalController.deleteFestival(req, res),
);

router.post("/artist/add", jwt, authorize(["empresa"]), (req, res) =>
  festivalController.addArtistToFestival(req, res),
);

router.post("/ticket/add", jwt, authorize(["empresa"]), (req, res) =>
  festivalController.addTicketToFestival(req, res),
);

router.post("/cancel", jwt, authorize(["empresa", "admin"]), (req, res) =>
  festivalController.cancelFestival(req, res),
);

router.use("/payment", festivalRoutes);

export default router;
