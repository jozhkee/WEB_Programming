import jwt from "jsonwebtoken";

/**
 * Extracts and verifies the user from the provided JWT token.
 * @param {string} token - The Authorization header containing the token.
 * @returns {object|null} - The decoded user object if the token is valid, otherwise null.
 */
export function getUserFromToken(token) {
  if (!token) return null;

  try {
    // Extract the token from the "Bearer <token>" format
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    return decoded; // Assuming the decoded token contains user information
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
