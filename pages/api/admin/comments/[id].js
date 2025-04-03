import { db } from "../../../../src";
import { comments } from "../../../../src/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../../../lib/adminAuth";

async function handler(req, res) {
  const { id } = req.query;
  const commentId = parseInt(id);

  if (isNaN(commentId)) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }

  // Handle DELETE request
  if (req.method === "DELETE") {
    try {
      const deletedComment = await db
        .delete(comments)
        .where(eq(comments.id, commentId))
        .returning({ id: comments.id });

      if (!deletedComment.length) {
        return res.status(404).json({ error: "Comment not found" });
      }

      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ error: "Failed to delete comment" });
    }
  }

  // Method not supported
  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
