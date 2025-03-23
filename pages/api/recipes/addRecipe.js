import { db } from "../../../src";
import { recipes } from "../../../src/db/schema";
import { getUserFromToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = getUserFromToken(req.headers.authorization);
    console.log("Decoded user:", user); // Debug log

    if (!user || !user.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid user" });
    }

    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      category,
    } = req.body;

    const prep_time = parseInt(prepTime);
    const cook_time = parseInt(cookTime);
    const servings_count = parseInt(servings);

    const [insertedRecipe] = await db
      .insert(recipes)
      .values({
        title,
        description,
        ingredients: JSON.stringify(ingredients),
        instructions,
        prep_time,
        cook_time,
        servings: servings_count,
        category,
        user_id: user.userId, // Use user.userId instead of user.id
      })
      .returning();

    res.status(201).json(insertedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
}
