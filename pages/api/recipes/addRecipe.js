import { db } from "../../../src";
import { recipes } from "../../../src/db/schema";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
    } = req.body;

    // Debug log
    console.log("Received values:", {
      prepTime,
      cookTime,
      servings,
    });

    // Validate required fields and ensure numeric values
    if (!title || !description || !ingredients || !instructions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prep_time = parseInt(prepTime);
    const cook_time = parseInt(cookTime);
    const servings_count = parseInt(servings);

    if (isNaN(prep_time) || prep_time < 0) {
      return res.status(400).json({ error: "Invalid prep time value" });
    }

    if (isNaN(cook_time) || cook_time < 0) {
      return res.status(400).json({ error: "Invalid cook time value" });
    }

    if (isNaN(servings_count) || servings_count < 1) {
      return res.status(400).json({ error: "Invalid servings value" });
    }

    // Insert the recipe into the database
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
      })
      .returning();

    // Return the newly created recipe
    res.status(201).json(insertedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      error: "Failed to create recipe",
      details: error.message,
    });
  }
}
