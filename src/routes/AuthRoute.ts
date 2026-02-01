import { Router } from "express";
import { AuthController } from "@controllers/AuthController";

const router = Router();
const authController = new AuthController();

// Shopkeeper Routes
router.post("/admin", authController.loginAdmin);

export default router;
