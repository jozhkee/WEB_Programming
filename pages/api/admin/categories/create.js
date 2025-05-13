import { db } from "../../../../src";
import { categories } from "../../../../src/db/schema";
import { requireAdmin } from "../../../../lib/adminAuth";
import { eq } from "drizzle-orm";

async function handler(req, res) {
  // Only handle POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, display_name } = req.body;

    // Validate input
    if (!name || !display_name) {
      return res
        .status(400)
        .json({ error: "Name and display name are required" });
    }

    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name));

    if (existingCategory.length > 0) {
      return res
        .status(400)
        .json({ error: "A category with this name already exists" });
    }

    const newCategory = await db
      .insert(categories)
      .values({
        name: name.toLowerCase(),
        display_name: display_name,
      })
      .returning();

    return res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Failed to create category" });
  }
}

export default requireAdmin(handler);
