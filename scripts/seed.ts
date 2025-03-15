import { db } from "../src/"; // Adjust path based on your project structure
import { recipes } from "../src/db/schema"; // Import your table schema
import { eq } from "drizzle-orm"; // Drizzle's query helpers

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert sample recipes
    await db.insert(recipes).values([
      {
        title: "Penne Alfredo",
        description:
          "Creamy Alfredo sauce with parmesan and garlic, served over penne pasta.",
      },
      {
        title: "Lemon Garlic Shrimp",
        description:
          "Shrimp sautéed in garlic and lemon butter sauce, served with fresh herbs.",
      },
      {
        title: "Vegetable Stir-Fry",
        description:
          "A colorful mix of stir-fried vegetables with soy sauce and sesame oil.",
      },
      {
        title: "BBQ Ribs",
        description:
          "Tender pork ribs slow-cooked with smoky BBQ sauce, served with coleslaw.",
      },
      {
        title: "Chicken Caesar Salad",
        description:
          "Crisp romaine lettuce topped with grilled chicken, croutons, and Caesar dressing.",
      },
      {
        title: "Beef Tacos",
        description:
          "Ground beef seasoned with Mexican spices, served in soft tortillas with salsa and avocado.",
      },
      {
        title: "Pulled Pork Sandwiches",
        description:
          "Slow-cooked pulled pork with tangy BBQ sauce, served on a soft bun.",
      },
      {
        title: "Vegetable Lasagna",
        description:
          "Layers of pasta, ricotta cheese, spinach, and marinara sauce, baked to perfection.",
      },
      {
        title: "Fish Tacos",
        description:
          "Grilled fish fillets in soft tortillas, topped with cabbage slaw and a creamy sauce.",
      },
      {
        title: "Pumpkin Soup",
        description:
          "A creamy, comforting soup made with pureed pumpkin, onions, and spices.",
      },
    ]);

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

seed().then(() => process.exit());
