import { Router } from "express";
import { CouponController } from "@controllers/CouponController";
import { authenticateShopKeeperToken } from "@middlewares/AuthMiddleware";

const router = Router();
const couponController = new CouponController();

router.get("/:pinCode", couponController.generateQRToken);
router.put("/",authenticateShopKeeperToken , couponController.redeemCoupon);

export default router;