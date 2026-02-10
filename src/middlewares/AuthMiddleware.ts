// src/middlewares/AuthMiddleware.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@utils/AppError";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

// ✅ Extract token from cookie OR Authorization header
function extractToken(req: Request): string | null {
  // 1. Try cookie first (for browser-based apps)
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  // 2. Fallback to Authorization header (for mobile apps, Postman, etc.)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

// ✅ Base authentication function (DRY principle)
async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
  allowedRoles: string[]
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultSecret"
    ) as { id: string; username: string; role: string };

    req.user = decoded;

    if (!allowedRoles.includes(decoded.role)) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid or expired token" });
    } else if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Authentication error" });
    }
  }
}

// ✅ User or Admin middleware
export async function authenticateUserToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authenticate(req, res, next, ["user", "admin"]);
}

// ✅ Admin only middleware
export async function authenticateAdminToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authenticate(req, res, next, ["admin"]);
}