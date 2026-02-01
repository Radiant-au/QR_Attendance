import { Router } from "express";
import AuthRoute from "@routes/AuthRoute"
import ShopkeeperRoute from "@routes/ShopkeeperRoute"
import CouponRoute from "./CouponRoute";
import UserRoute from "./UserRoute";
const router = Router();

router.use("/auth", AuthRoute);
router.use("/user", UserRoute)
router.use("/shopkeeper", ShopkeeperRoute)
router.use("/coupon", CouponRoute)


export default router;