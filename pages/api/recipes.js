import { db } from "../../src/";
import { recipes } from "../../src/db/schema";

export default async function handler(req, res) {
  try {
    console.log("API: Fetching recipes from database");
    // Fetch recipes from the database
    const allRecipes = await db.select().from(recipes);
    console.log("API: Found", allRecipes.length, "recipes");
    res.status(200).json(allRecipes);
  } catch (error) {
    console.error("API Error fetching recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
