import { Router } from "express";
import { AuthController } from "@controllers/AuthController";
import { validateBody } from "@middlewares/ValidationMiddleware";
import { LoginRequestDTO } from "@dtos/AuthDto";
import { authenticateUserToken } from "@middlewares/AuthMiddleware";

const router = Router();
const authController = new AuthController();

// Admin Routes
router.post("/admin",validateBody(LoginRequestDTO), authController.login);
router.post("/user", validateBody(LoginRequestDTO), authController.login);
router.get("/me", authenticateUserToken, authController.me)

export default router;
