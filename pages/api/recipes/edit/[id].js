import { db } from "../../../../src";
import { recipes } from "../../../../src/db/schema";
import { eq } from "drizzle-orm";
import { saveImageToLocal } from "../../../../src/utils/imageUpload";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const existingRecipe = await db
      .select({ image_url: recipes.image_url })
      .from(recipes)
      .where(eq(recipes.id, recipeId));

    if (!existingRecipe.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

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
      removeImage,
    } = recipeData;

    let finalImageUrl = existingRecipe[0].image_url;

    if (imageUrl) {
      if (finalImageUrl && !finalImageUrl.includes("http")) {
        const oldImagePath = path.join(process.cwd(), "public", finalImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      finalImageUrl = imageUrl;
    } else if (removeImage) {
      if (finalImageUrl && !finalImageUrl.includes("http")) {
        const oldImagePath = path.join(process.cwd(), "public", finalImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      finalImageUrl = null;
    }

    const updateData = {
      title,
      description,
      ingredients: JSON.stringify(ingredients),
      instructions: instructions.trim(),
      prep_time: parseInt(prep_time, 10),
      cook_time: parseInt(cook_time, 10),
      servings: parseInt(servings, 10),
      category: category.toLowerCase(),
      image_url: finalImageUrl,
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
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
}
