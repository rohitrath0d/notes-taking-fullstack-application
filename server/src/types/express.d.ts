import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string 
      };  // Adding the `user` property to the Request interface
    }
  }
}