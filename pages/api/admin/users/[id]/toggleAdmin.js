import { db } from "../../../../../src";
import { users } from "../../../../../src/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../../../../lib/adminAuth";

async function handler(req, res) {
  const { id } = req.query;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // Handle PUT request
  if (req.method === "PUT") {
    const { is_admin } = req.body;

    if (typeof is_admin !== "boolean") {
      return res.status(400).json({ error: "Invalid admin status" });
    }

    try {
      const updatedUser = await db
        .update(users)
        .set({ is_admin })
        .where(eq(users.id, userId))
        .returning({ id: users.id, is_admin: users.is_admin });

      if (!updatedUser.length) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(updatedUser[0]);
    } catch (error) {
      console.error("Error updating user admin status:", error);
      return res
        .status(500)
        .json({ error: "Failed to update user admin status" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
