import { db } from "../../src";
import { categories } from "../../src/db/schema";

export default async function handler(req, res) {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(categories.display_name);

    res.status(200).json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}
