import { db } from "../../../src";
import { recipes } from "../../../src/db/schema";
import { getUserFromToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Recipe data received:", req.body);

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
      prep_time, // Use the same names as sent from client
      cook_time, // Use the same names as sent from client
      servings,
      category,
    } = req.body;

    const servings_count = parseInt(servings);

    console.log("Attempting to save recipe to database");

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
        user_id: user.userId,
        created_at: new Date(),
      })
      .returning();

    console.log("Database operation result:", insertedRecipe);

    res.status(201).json(insertedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
}
