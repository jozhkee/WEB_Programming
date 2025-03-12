import { db } from "../src/"; // Adjust path based on your project structure
import { recipes } from "../src/db/schema"; // Import your table schema
import { eq } from "drizzle-orm"; // Drizzle's query helpers

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert sample recipes
    await db.insert(recipes).values([
      { title: "Spaghetti Carbonara", description: "Classic Italian pasta with eggs, cheese, pancetta, and pepper." },
      { title: "Chicken Tikka Masala", description: "Indian-style grilled chicken in a creamy tomato sauce." },
      { title: "Chocolate Chip Cookies", description: "Crispy edges, chewy middle, loaded with chocolate chips." },
      { title: "Margherita Pizza", description: "Pizza with fresh mozzarella, tomatoes, and basil." },
      { title: "Beef Stroganoff", description: "Sautéed beef in a creamy mushroom sauce over egg noodles." },
    ]);

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

seed().then(() => process.exit());
