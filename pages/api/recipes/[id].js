import { db } from "../../../src";
import { recipes } from "../../../src/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { id } = req.query;

  const recipeId = parseInt(id, 10);

  if (isNaN(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  try {
    const recipe = await db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        ingredients: recipes.ingredients,
        instructions: recipes.instructions,
        prep_time: recipes.prep_time,
        cook_time: recipes.cook_time,
        servings: recipes.servings,
        category: recipes.category,
        user_id: recipes.user_id,
      })
      .from(recipes)
      .where(eq(recipes.id, recipeId));

    if (!recipe.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    console.log("Fetched recipe data:", recipe[0]); // Log to see if instructions are present

    res.status(200).json(recipe[0]);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
