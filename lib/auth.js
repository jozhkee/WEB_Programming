import jwt from "jsonwebtoken";

/**
 * Extracts and verifies the user from the provided JWT token.
 * @param {string} token - The Authorization header containing the token.
 * @returns {object|null} - The decoded user object if the token is valid, otherwise null.
 */
export function getUserFromToken(token) {
  if (!token) return null;
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined!");
    return null;
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
