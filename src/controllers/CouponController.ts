import { Request, Response } from "express";
import { asyncHandler } from "@middlewares/handler";
import { CouponService } from "@services/CouponService";
import { ShopkeeperService } from "@services/ShopkeeperService";
import { AppError } from "@utils/AppError";

export class CouponController {

  // CREATE SHOP
  generateQRToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const pinCode = req.params.pinCode;
      const couponQR = await CouponService.generateStaticQRToken(pinCode);
      res.status(200).json({
        message: "Generated successfully",
        data: couponQR,
      });
    }
  );

  redeemCoupon = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new AppError('Authorization header is missing', 401);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AppError('Token is missing', 401);
        }
      const shopkeeperId = ShopkeeperService.getShopKeeperFromJWT(token);
      const RedeemData = {
        ...req.body,
        shopkeeperId,
      };
      const couponQR = await CouponService.redeemCoupon(RedeemData);
      res.status(200).json({
        message: "Redeemed successfully",
        data: couponQR,
      });
    }
  );

}