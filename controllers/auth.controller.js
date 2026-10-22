import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import { generateToken } from '../utils/generateToken.js';


export const profile = async (req, res, next) => {
    return res.status(200).json({ success: true, message: 'Profile Route accessed successfully' });
}

/**
 * 1. LOGIN CONTROLLER
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Destructure to separate the password from the rest of the user object
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token using the sanitized object
    const token = generateToken(userWithoutPassword);

    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error during login." });
  }
};

/**
 * 3. ADMIN USER CREATION CONTROLLER (Enforces 6-user limit)
 * Note: Should be protected by a middleware that verifies if req.user is ADMIN or SUPERADMIN
 */
export const createUserByAdmin = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required." });
    }

    // Enforce absolute limit of 6 total users (1 superadmin + 5 team users)
    const totalUsersCount = await prisma.user.count();
    if (totalUsersCount >= 6) {
      return res.status(400).json({ 
        error: "User limit reached. Maximum allowed is 5 users (1 admin + 4 team users)." 
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "A user with this email already exists." });
    }

    // Generate a secure random temporary password (e.g., 8 alphanumeric chars)
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || "STAFF", // Defaults to STAFF if not specified
      },
    });

    // TODO: Trigger your email service here (e.g., Brevo / Nodemailer)
    // Example: await sendWelcomeEmail(email, generatedPassword);
    console.log(`[DEV ONLY] Generated password for ${email}: ${generatedPassword}`);

    return res.status(201).json({
      message: "User created successfully. Credentials generated and ready to be sent.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("User creation error:", error);
    return res.status(500).json({ error: "Internal server error while creating user." });
  }
};

/**
 * 4. LOGOUT CONTROLLER
 */
export const logoutUser = async (req, res) => {
  try {
    // Clear both receipt and user from the request object
    req.user = null; 
    req.receipt = null; 
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal server error during logout." });
  }
};