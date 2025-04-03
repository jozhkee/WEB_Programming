import { db } from "../../../src";
import { users } from "../../../src/db/schema";
import { requireAdmin } from "../../../lib/adminAuth";

async function handler(req, res) {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        is_admin: users.is_admin,
      })
      .from(users);

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export default requireAdmin(handler);
