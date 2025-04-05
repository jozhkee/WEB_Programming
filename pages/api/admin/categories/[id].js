import { db } from "../../../../src";
import { categories } from "../../../../src/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../../../lib/adminAuth";

async function handler(req, res) {
  const { id } = req.query;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  // Handle DELETE request
  if (req.method === "DELETE") {
    try {
      // First check if this is the last category - don't allow deletion of the last category
      const allCategories = await db.select().from(categories);
      if (allCategories.length <= 1) {
        return res.status(400).json({
          error:
            "Cannot delete the last category. At least one category must exist.",
        });
      }

      const deletedCategory = await db
        .delete(categories)
        .where(eq(categories.id, categoryId))
        .returning();

      if (!deletedCategory.length) {
        return res.status(404).json({ error: "Category not found" });
      }

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Failed to delete category" });
    }
  }

  // Method not supported
  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
