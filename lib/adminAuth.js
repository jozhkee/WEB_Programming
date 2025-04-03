import { authUtils } from "../pages/api/auth/auth";

export function requireAdmin(handler) {
  return async (req, res) => {
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

      // Add user data to request
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Authentication failed" });
    }
  };
}
