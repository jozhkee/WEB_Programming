import { db } from "../../../../src";
import { recipes } from "../../../../src/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromToken } from "../../../../lib/auth";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = getUserFromToken(req.headers.authorization);

    if (!user || !user.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid user" });
    }

    const recipeId = parseInt(id, 10);
    if (isNaN(recipeId)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    // First check if the recipe exists and belongs to the user
    const recipeToDelete = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .where(eq(recipes.user_id, user.userId));

    if (!recipeToDelete.length) {
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized" });
    }

    // Delete the recipe
    const deletedRecipe = await db
      .delete(recipes)
      .where(eq(recipes.id, recipeId))
      .returning();

    res
      .status(200)
      .json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
