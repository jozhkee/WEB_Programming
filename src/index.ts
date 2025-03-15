import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { recipes } from "./db/schema";

export const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Define the data to be inserted
  const newRecipe: typeof recipes.$inferInsert = {
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
  };

  // Insert the new recipe
  await db.insert(recipes).values(newRecipe);
  console.log("New recipe created!");

  // Get all recipes from the database
  const allRecipes = await db.select().from(recipes);
  console.log("Getting all recipes from the database: ", allRecipes);

  // Update a recipe's description where the title matches
  const recipeToUpdate = allRecipes.find(
    (r) => r.title === "Spaghetti Carbonara"
  );
  if (recipeToUpdate) {
    await db
      .update(recipes)
      .set({ description: "Updated description for Spaghetti Carbonara" })
      .where(eq(recipes.title, recipeToUpdate.title));
    console.log("Recipe info updated!");
  }

  // Delete a recipe where the title matches
  const recipeToDelete = allRecipes.find(
    (r) => r.title === "Spaghetti Carbonara"
  );
  if (recipeToDelete) {
    await db.delete(recipes).where(eq(recipes.title, recipeToDelete.title));
    console.log("Recipe deleted!");
  }
}

main().catch((err) => {
  console.error("Error occurred: ", err);
});
