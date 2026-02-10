import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";
import { RefreshToken } from "../models/RefreshToken.model.js";

/* ===============================
   GENERATE ACCESS TOKEN
=============================== */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      wallet: user.walletAddress,
      role: user.role,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES },
  );
};

/* ===============================
   GENERATE REFRESH TOKEN
=============================== */
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
