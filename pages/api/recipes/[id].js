import { db } from "../../../src";
import { recipes, users } from "../../../src/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const recipeId = parseInt(id, 10);

    if (isNaN(recipeId)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    const result = await db
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
        image_url: recipes.image_url,
        author_name: users.username,
      })
      .from(recipes)
      .leftJoin(users, eq(recipes.user_id, users.id))
      .where(eq(recipes.id, recipeId));

    if (result.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    console.log("Fetched recipe data:", result[0]);
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
}
