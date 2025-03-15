import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../../src/";
import { users } from "../../../src/db/schema";

// JWT configuration
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRES_IN = "24h";

/**
 * Core authentication utilities
 */
export const authUtils = {
  /**
   * Generate JWT token for user
   */
  generateToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  },

  /**
   * Hash a password
   */
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  /**
   * Verify a password against a hash
   */
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },

  /**
   * Check if user exists by email
   */
  async getUserByEmail(email) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user.length > 0 ? user[0] : null;
  },

  /**
   * Authenticate request middleware for API routes
   */
  async authenticateRequest(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { authenticated: false, error: "Authentication required" };
      }

      const token = authHeader.split(" ")[1];
      const decoded = this.verifyToken(token);

      // Add user data to request
      return { authenticated: true, user: decoded };
    } catch (error) {
      return { authenticated: false, error: "Authentication failed" };
    }
  },
};

// Export a default function for Next.js API routes that need authentication
export default async function withAuth(req, res, handler) {
  const auth = await authUtils.authenticateRequest(req, res);

  if (!auth.authenticated) {
    return res.status(401).json({ message: auth.error });
  }

  // Add user to request and proceed
  req.user = auth.user;
  return handler(req, res);
}
