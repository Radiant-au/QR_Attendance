import { Request, Response } from "express";
import { asyncHandler } from "@middlewares/handler";
import { UsersService } from "@services/UsersService";

export class UserController {

  getUserQr = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    const qrToken = await UsersService.getMyDynamicQr(userId);
    res.status(200).json(qrToken);
  })

  // CREATE SHOP
  createUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userData = req.body;
      const user = await UsersService.createUser(userData);
      res.status(201).json(user);
    }
  );

  // GET ALL SHOPS (only active by default)
  getAllUsers = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const users = await UsersService.getAllUsers();
      res.status(200).json(users);
    }
  );

  // GET SHOP BY ID
  getUserById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const id = req.params.id as string;
      const user = await UsersService.getUserById(id);
      res.status(200).json(user);
    }
  );

  // UPDATE SHOP
  updateUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const id = req.params.id as string;
      const data = req.body;
      const updatedUser = await UsersService.updateUser(id, data);
      res.status(200).json(updatedUser);
    }
  );
  // HARD DELETE SHOP

  deleteUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const id = req.params.id as string;
      await UsersService.deleteUser(id);
      res.status(200).json({
        message: "User deleted successfully",
      });
    }
  );

}