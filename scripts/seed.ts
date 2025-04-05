import { seedUsers } from "./seedUser";
import { seedRecipes } from "./seedRecipes";
import { seedComments } from "./seedComments";
import { seedCategories } from "./seedCategories";

async function seedAll() {
  try {
    console.log("Starting complete database seeding...");

    console.log("Step 1: Seeding users");
    await seedUsers();

    console.log("Step 2: Seeding categories");
    await seedCategories();

    console.log("Step 3: Seeding recipes");
    await seedRecipes();

    console.log("Step 4: Seeding comments");
    await seedComments();

    console.log("All data seeded successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

seedAll()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
