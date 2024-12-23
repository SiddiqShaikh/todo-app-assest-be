import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { StatusCodes } from "http-status-codes";
interface DecodedToken {
  _id: string;
  iat: number;
  exp: number;
}

export const verifyJWT: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED)
         .json({ error: "User not found", details: null });
      return;
    }
    const decodedToken = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as DecodedToken;
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED)
         .json({ error: "Invalid token", details: null });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
       .json({ error: "Internal Server Error", details: null });
  }
};
