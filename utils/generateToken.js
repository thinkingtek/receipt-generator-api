import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { env } from "../config/envConfig.js";


// Generate a JWT token for a given user ID
export const generateToken = (user) => {
  return jwt.sign(
    { user },env.jwtSecret,
    { expiresIn: env.jwtExpiration } // Default to 7 days if not set
  );
};

export function generateJwtSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
};