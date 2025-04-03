import { db } from "../../../src";
import { comments } from "../../../src/db/schema";
import { requireAdmin } from "../../../lib/adminAuth";

async function handler(req, res) {
  try {
    const allComments = await db
      .select()
      .from(comments)
      .orderBy(comments.created_at, "desc");

    res.status(200).json(allComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

export default requireAdmin(handler);
