import { db } from "../src";
import { categories } from "../src/db/schema";

export async function seedCategories() {
  try {
    console.log("Starting to seed categories...");

    // Check if categories already exist
    const existingCategories = await db.select().from(categories);

    if (existingCategories.length > 0) {
      console.log(
        `Found ${existingCategories.length} existing categories. Skipping seeding.`
      );
      return existingCategories;
    }

    const categoriesData = [
      { name: "pasta", display_name: "Pasta" },
      { name: "desserts", display_name: "Desserts" },
      { name: "main dishes", display_name: "Main Dishes" },
      { name: "vegan", display_name: "Vegan" },
      { name: "vegetarian", display_name: "Vegetarian" },
      { name: "salads", display_name: "Salads" },
      { name: "sandwiches", display_name: "Sandwiches" },
      { name: "finger foods", display_name: "Finger Foods" },
      { name: "soups", display_name: "Soups" },
      { name: "breakfast", display_name: "Breakfast" },
      { name: "drinks", display_name: "Drinks" },
    ];

    const insertedCategories = await db
      .insert(categories)
      .values(categoriesData)
      .returning();

    console.log(`Seeded ${insertedCategories.length} categories successfully`);
    return insertedCategories;
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedCategories()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
