import { db } from "../../../../src";
import { users } from "../../../../src/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../../../lib/adminAuth";

async function handler(req, res) {
  const { id } = req.query;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // Handle DELETE request
  if (req.method === "DELETE") {
    try {
      const deletedUser = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning({ id: users.id });

      if (!deletedUser.length) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  }

  // Method not supported
  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
