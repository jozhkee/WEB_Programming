import { db } from "../../src/"; 
import { recipes } from "../../src/db/schema";

export default async function handler(req, res) {
  try {
    // Fetch recipes from the database
    const allRecipes = await db.select().from(recipes);

    res.status(200).json(allRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
