import { Router } from "express";

import enterpriseRoutes from "./enterprise.routes";
import artistRoutes from "./artist.routes";
import authRoutes from "./auth.routes";
import clientRoutes from "./client.routes";
import festivalRoutes from "./festival.routes";
import logsRoutes from "./logs.routes";

const router = Router();

router.use("/enterprise", enterpriseRoutes);
router.use("/artist", artistRoutes);
router.use("/auth", authRoutes);
router.use("/client", clientRoutes);
router.use("/festival", festivalRoutes);
router.use("/logs", logsRoutes);

export default router;
