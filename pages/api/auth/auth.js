import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../../src/";
import { users } from "../../../src/db/schema";

// JWT configuration
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "91f13ecaa38a54734ab74a9025a5dfa7926b80d08e4d6b1cd699758e2b46c6847b7cd9b861575aa0449e5718929548d169e49d7f7bff9f201d8795bb2cab5a8a";
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
        username: user.username,
        isAdmin: user.is_admin || false,
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
   * Check if user exists by username
   */
  async getUserByUsername(username) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user.length > 0 ? user[0] : null;
  },

  /**
   * Check if user is admin
   */
  isAdmin(user) {
    return user && user.isAdmin === true;
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
