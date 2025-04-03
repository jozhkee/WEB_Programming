import { db } from "../../../src";
import { recipes, users } from "../../../src/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../../lib/adminAuth";

async function handler(req, res) {
  try {
    const allRecipes = await db
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
        created_at: recipes.created_at,
        author_name: users.username,
      })
      .from(recipes)
      .leftJoin(users, eq(recipes.user_id, users.id));

    res.status(200).json(allRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}

export default requireAdmin(handler);
