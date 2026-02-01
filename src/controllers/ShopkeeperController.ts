import { Request, Response } from "express";
import { ShopkeeperService } from "../services/ShopkeeperService";
import { asyncHandler } from "../middlewares/handler"; // Adjust path based on your project
import { AppError } from "@utils/AppError";

const shopkeeperService = new ShopkeeperService();

export class ShopkeeperController {
  static create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      const result = await shopkeeperService.registerShopKeeper(data);
      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // GET ALL
  static getAll = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await shopkeeperService.findAll();
      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // GET ONE
  static getOne = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await shopkeeperService.findOne(Number(req.params.id));
      if (!result) {
        throw new AppError("Shopkeeper not found", 404);
      }
      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // DELETE
  static delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await shopkeeperService.delete(Number(req.params.id));
      res.status(204).send();
    }
  );
}
