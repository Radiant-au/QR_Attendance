import { Router } from "express";
import { ShopkeeperController } from "../controllers/ShopkeeperController";
import { validateBody } from "@middlewares/ValidationMiddleware";
import { CreateShopkeeperDTO } from "@dtos/ShopkeeperDto";
import { authenticateAdminToken, authenticateShopKeeperToken } from "@middlewares/AuthMiddleware";
const router = Router();

router.get("/",authenticateAdminToken, ShopkeeperController.getAll);
router.get("/:id", authenticateShopKeeperToken, ShopkeeperController.getOne);
router.post("/",authenticateAdminToken, validateBody(CreateShopkeeperDTO) ,ShopkeeperController.create);
router.delete("/:id", authenticateAdminToken, ShopkeeperController.delete);

export default router;