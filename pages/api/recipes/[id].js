import { db } from "../../../src/";
import { recipes } from "../../../src/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // Convert ID to number for proper comparison
    const recipeId = parseInt(id, 10);

    // Fetch specific recipe from the database
    const recipe = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (recipe.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Return the first (and only) result
    res.status(200).json(recipe[0]);
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
