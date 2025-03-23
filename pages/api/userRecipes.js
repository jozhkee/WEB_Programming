import { db } from "../../src";
import { recipes } from "../../src/db/schema";
import { eq } from "drizzle-orm"; // Import the `eq` function for filtering
import { getUserFromToken } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Authorization header:", req.headers.authorization); // Debug log
    const user = getUserFromToken(req.headers.authorization);
    console.log("Decoded user:", user); // Debug log

    if (!user || !user.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid user" });
    }

    // Fetch recipes for the logged-in user
    const userRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.user_id, user.userId)); // Use `eq` for filtering

    console.log("Fetched recipes:", userRecipes); // Debug log

    if (!userRecipes || userRecipes.length === 0) {
      return res.status(200).json([]); // Return an empty array if no recipes are found
    }

    res.status(200).json(userRecipes);
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    res.status(500).json({ error: "Failed to fetch user recipes" });
  }
}
