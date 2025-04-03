import { authUtils } from "../auth/auth";

export default function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = authUtils.verifyToken(token);

    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    // User is admin
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
}
