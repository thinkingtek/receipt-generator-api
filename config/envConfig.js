import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const env = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || "7d", // Default to 7 days if not set
  nodeEnv: process.env.NODE_ENV || "development",
};