import { Router } from "express";
import { UserController } from "@controllers/UserController";
import { validateBody } from "@middlewares/ValidationMiddleware";
import { CreateUserRequestDto, UpdateUserRequestDto } from "@dtos/UserDto";
import { authenticateAdminToken, authenticateUserToken } from "@middlewares/AuthMiddleware";

const router = Router();
const userController = new UserController();

// User Routes
router.post("/", authenticateAdminToken, validateBody(CreateUserRequestDto), userController.createUser);
router.get("/getQR/:id", authenticateUserToken, userController.getUserQr)
router.get("/", authenticateAdminToken, userController.getAllUsers);
router.get("/:id", authenticateUserToken, userController.getUserById);
router.put("/:id", authenticateAdminToken, validateBody(UpdateUserRequestDto), userController.updateUser);
router.delete("/:id", authenticateAdminToken, userController.deleteUser);

export default router;