import { AdminRepository } from "@repositories/UsersRepository";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authenticateShopKeeperToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
       res.status(401).json({ message: "Token is not provided" });
       return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret") as { id: number; role: string };
      if(decoded.role === "shopkeeper"){
        next()
      }else{
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (err) {
      res.status(401).json({ message: "Token is not valid or expired" });
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret") as { id: number };
    if (!decoded?.id) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
    const admin = await AdminRepository.findOneBy({id : decoded.id});
    if(admin){
        next();
    }else{
        res.status(401).json({ message: "Token is not valid or expired" });
    }

  } catch (err) {
    res.status(401).json({ message: "Token is not valid or expired" });
  }
}