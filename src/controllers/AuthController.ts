import { Request, Response } from "express";
import { asyncHandler } from "@middlewares/handler";
import { ShopKeeperAuthService } from "@services/AuthService";

export class AuthController {

  // LOGIN ADMIN
  loginAdmin = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = req.body;

      const result = await ShopKeeperAuthService.Adminlogin(data);

      res.status(200).json(result);
    }
  );
}
