import { Router } from "express";
import { AuthController } from "@controllers/AuthController";

const router = Router();
const authController = new AuthController();

// Admin Routes
router.post("/admin", authController.login);
router.post("/user", authController.login);

export default router;
