import { Router } from "express";
import { UserController } from "@controllers/UserController";
import { validateBody } from "@middlewares/ValidationMiddleware";
import { CreateUserRequestDto, UpdateUserRequestDto } from "@dtos/UserDto";

const router = Router();
const userController = new UserController();

// Shop Routes
router.post("/", validateBody(CreateUserRequestDto), userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", validateBody(UpdateUserRequestDto), userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;