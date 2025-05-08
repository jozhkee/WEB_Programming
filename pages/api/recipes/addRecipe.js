import { db } from "../../../src";
import { recipes } from "../../../src/db/schema";
import { getUserFromToken } from "../../../lib/auth";
import { saveImageToLocal } from "../../../src/utils/imageUpload";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = getUserFromToken(req.headers.authorization);

    if (!user || !user.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid user" });
    }

    // Process the uploaded image and form data
    const { recipeData, imageUrl } = await saveImageToLocal(req);

    const {
      title,
      description,
      ingredients,
      instructions,
      prep_time,
      cook_time,
      servings,
      category,
    } = recipeData;

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
        user_id: user.userId,
        created_at: new Date(),
        image_url: imageUrl,
      })
      .returning();

    res.status(201).json(insertedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res
      .status(500)
      .json({ error: "Failed to create recipe: " + error.message });
  }
}
