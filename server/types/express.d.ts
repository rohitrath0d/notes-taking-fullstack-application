import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      // user?: {
      //   // id: string,
      //   // id: string,
      //   user?: any; // type properly if you know your user object
      //   // id: any 
      // };  // Adding the `user` property to the Request interface

      user?: any; // type properly if you know your user object
    }
  }
}