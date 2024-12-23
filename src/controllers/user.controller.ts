import { Request, RequestHandler, Response } from "express";
import { User } from "../models/user.model";

import { StatusCodes } from "http-status-codes";
const generateAccessTokenAndRefreshToken = async (userID: unknown) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new Error("User not found");
    }

    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw error;
  }
};
const registerUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existinguser = await User.findOne({ email });

    if (existinguser) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User already exist", details: null });
      return;
    }

    const newUser = await User.create({ email, password });
    const user = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    res.status(StatusCodes.CREATED).json({
      status: true,
      user,
      message: "Register successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, error: "Internal Server Error" });
  }
};

const loginUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found", details: null });
      return;
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid credentials", details: null });
      return;
    }
    const { refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(StatusCodes.OK)
      .cookie("refreshToken", refreshToken, options)
      .json({
        status: true,
        loggedInUser,
        token: refreshToken,
        message: "Login successful",
      });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, error: "Internal Server Error" });
  }
};
export { registerUser, loginUser };
