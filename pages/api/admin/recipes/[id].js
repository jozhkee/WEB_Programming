import { db } from "../../../../src";
import { recipes } from "../../../../src/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../../../lib/adminAuth";

async function handler(req, res) {
  const { id } = req.query;
  const recipeId = parseInt(id);

  if (isNaN(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  // Handle DELETE request
  if (req.method === "DELETE") {
    try {
      const deletedRecipe = await db
        .delete(recipes)
        .where(eq(recipes.id, recipeId))
        .returning({ id: recipes.id });

      if (!deletedRecipe.length) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      return res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return res.status(500).json({ error: "Failed to delete recipe" });
    }
  }

  // Method not supported
  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
