import { authUtils } from "./auth";
import { db } from "../../../src/";
import { users } from "../../../src/db/schema";

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, username, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if user already exists
    const existingUser = await authUtils.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Check if username is already taken
    const existingUsername = await authUtils.getUserByUsername(username);

    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await authUtils.hashPassword(password);

    try {
      await db.insert(users).values({
        email: email,
        username: username,
        password: hashedPassword,
      });

      // Fetch the created user
      const newUser = await authUtils.getUserByEmail(email);

      if (!newUser) {
        throw new Error("Failed to create user");
      }

      // Generate JWT token
      const token = authUtils.generateToken(newUser);

      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to create user: ${insertError.message}`);
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
