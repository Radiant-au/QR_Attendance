// src/controllers/AuthController.ts
import { Request, Response } from "express";
import { asyncHandler } from "@middlewares/handler";
import { AuthService } from "@services/AuthService";
import { AuthRequest } from "@middlewares/AuthMiddleware";
import { env } from "@config/env";
// import { AuthRequest } from "@middlewares/AuthMiddleware";

export class AuthController {
  // ✅ LOGIN - Set HTTP-only cookie here
    login = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      const result = await AuthService.login(data);
      
      const isProduction = env.ENV === "production";
      
      // ✅ Set cookie (for browser)
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: parseInt(process.env.JWT_EXPIRE_MINUTES || "15") * 60 * 1000,
      });
      
      // ✅ ALSO return token in response (for development/mobile/testing)
      res.status(200).json({ 
        user: result.user,
        token: result.token  // 👈 Add this for flexibility
      });
    }
  );

  // ✅ LOGOUT - Clear cookie here
  logout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // ✅ Controller clears HTTP-only cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.status(200).json({ message: "Logged out successfully" });
    }
  );

  // ✅ GET CURRENT USER - Protected route
  me = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      // User ID comes from auth middleware
      const userId = req.user!.id;

      const user = await AuthService.getCurrentUser(userId);

      res.status(200).json({ user });
    }
  );
}