import { db } from "../../../../src";
import { recipes } from "../../../../src/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authToken = req.headers.authorization?.split(" ")[1];
  if (!authToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const recipeId = parseInt(id, 10);
  if (isNaN(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      ingredients: JSON.stringify(req.body.ingredients),
      instructions: req.body.instructions.trim(),
      prep_time: parseInt(req.body.prep_time, 10),
      cook_time: parseInt(req.body.cook_time, 10),
      servings: parseInt(req.body.servings, 10),
      category: req.body.category.toLowerCase(),
    };

    const updatedRecipe = await db
      .update(recipes)
      .set(updateData)
      .where(eq(recipes.id, recipeId))
      .returning();

    if (!updatedRecipe.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe[0]);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
