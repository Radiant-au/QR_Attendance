import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authenticateUserToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: "Token is not provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret") as { id: number; role: string };
    if (decoded.role === "user") {
      next()
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token is not valid or expired", error: err });
  }
}

export async function authenticateAdminToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: "Token is not provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret") as { id: number; role: string };
    if (decoded.role === "admin") {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }

  } catch (err) {
    res.status(401).json({ message: "Token is not valid or expired", error: err });
  }
}