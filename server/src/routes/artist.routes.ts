import { Router } from "express";
import { artistController } from "../controllers/";

const router = Router();
router.get("/", (req, res) => artistController.getAllArtists(req, res));
router.get("/search", artistController.musicSearch);
router.get("/details/:id", artistController.getArtistDetails);
export default router;
