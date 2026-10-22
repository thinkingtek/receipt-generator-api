import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { env } from "../config/envConfig.js";


export const isAuthenticated = async (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } 

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please log in to continue." });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired session. Please log in again.", msg: error.message });
  }
};

/**
 * 2. Middleware: Checks if the logged-in user is an ADMIN or SUPERADMIN
 * Note: Must always be placed AFTER `isAuthenticated` so `req.user` exists.
 */
export const isAdminOrSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized. Authentication required first." });
  }

  const { role } = req.user;

  // Matches the Prisma enum values: ADMIN or SUPERADMIN
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return res.status(403).json({ 
      error: "Access denied. You do not have the required administrative privileges." 
    });
  }
  next();
};