import crypto from "crypto";
// import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import User from "../models/User.model.js";
import { env } from "../config/env.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { RefreshToken } from "../models/RefreshToken.model.js";

/* =========================
   GET NONCE
========================= */
export const getNonce = async (req, res) => {
  const { wallet } = req.query;

  if (!wallet) {
    return res.status(400).json({ message: "Wallet address required" });
  }

  let user = await User.findOne({ walletAddress: wallet.toLowerCase() });

  if (!user) {
    user = await User.create({
      walletAddress: wallet.toLowerCase(),
      nonce: crypto.randomBytes(16).toString("hex"),
    });
  }

  res.json({
    nonce: user.nonce,
    message: `Sign this message to login: ${user.nonce}`,
  });
};

/* =========================
   VERIFY SIGNATURE
========================= */


export const verifySignature = async (req, res) => {
  const { wallet, signature } = req.body;

  if (!wallet || !signature) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const user = await User.findOne({ walletAddress: wallet.toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const message = `Sign this message to login: ${user.nonce}`;
  const recoveredAddress = ethers.verifyMessage(message, signature);

  if (recoveredAddress.toLowerCase() !== wallet.toLowerCase()) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  // 🔐 Rotate nonce
  user.nonce = crypto.randomBytes(16).toString("hex");
  await user.save();

  // ✅ SECURE TOKENS
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  res.json({
    accessToken,
    refreshToken,
    user: {
      wallet: user.walletAddress,
      role: user.role,
    },
  });
};



export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  await RefreshToken.deleteOne({ token: refreshToken });

  res.json({ message: "Logged out successfully" });
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
  }).populate("user");

  if (!storedToken) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  // Rotate
  await RefreshToken.deleteOne({ _id: storedToken._id });

  const newAccessToken = generateAccessToken(storedToken.user);
  const newRefreshToken = await generateRefreshToken(storedToken.user);

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};
