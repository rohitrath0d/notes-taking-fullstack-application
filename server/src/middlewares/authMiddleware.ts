import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../types/type.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string };
    console.log("Decoded token:", decoded);
    
    req.user = { id: decoded.id } as User;
    console.log("User authenticated:", req.user);
    next();
    return;
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token. || unauthorized"
    });
  }
};