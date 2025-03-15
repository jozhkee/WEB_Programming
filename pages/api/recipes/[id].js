import { db } from "../../../src";
import { recipes } from "../../../src/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { id } = req.query;

  // Ensure ID is a valid number
  const recipeId = parseInt(id, 10);

  if (isNaN(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  try {
    const recipe = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId));

    if (!recipe.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(recipe[0]);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
