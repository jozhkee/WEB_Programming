import { db } from "../../../src";
import { recipes } from "../../../src/db/schema";
import { requireAdmin } from "../../../lib/adminAuth";

async function handler(req, res) {
  try {
    const allRecipes = await db.select().from(recipes);

    res.status(200).json(allRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}

export default requireAdmin(handler);
