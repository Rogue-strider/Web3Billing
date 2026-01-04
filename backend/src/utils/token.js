import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RefreshToken } from "../models/RefreshToken.model.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      wallet: user.walletAddress,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );
};

export const generateRefreshToken = async (user) => {
  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    user: user._id,
    token,
    expiresAt,
  });

  return token;
};
