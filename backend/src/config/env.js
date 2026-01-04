import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
};
