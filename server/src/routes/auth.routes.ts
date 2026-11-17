import { Router } from "express";
import {
  enterpriseController,
  clientController,
  authController,
} from "../controllers";

const router = Router();

router.post("/admin/signin", authController.admin.signIn);
router.post("/enterprise/signup", enterpriseController.createEnterprise);
router.post("/enterprise/signin", authController.empresa.signIn);
router.post("/client/signup", clientController.createClient);
router.post("/client/signin", authController.cliente.signIn);

export default router;
