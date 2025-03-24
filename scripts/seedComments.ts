import { db } from "../src";
import { comments, recipes, users } from "../src/db/schema";
import { seedRecipes } from "./seedRecipes";
import { seedUsers } from "./seedUser";

export async function seedComments() {
  try {
    console.log("Starting to seed comments...");

    let allUsers = await db.select().from(users);
    if (allUsers.length === 0) {
      console.log("No users found. Creating users first...");
      allUsers = await seedUsers();
    }

    let allRecipes = await db
      .select({ id: recipes.id, title: recipes.title })
      .from(recipes);
    if (allRecipes.length === 0) {
      console.log("No recipes found. Creating recipes first...");
      allRecipes = await seedRecipes();
    }

    // Sample comments for recipes
    const commentTemplates = [
      "This recipe is amazing! I'll definitely make it again.",
      "I added {ingredient} and it was even better!",
      "My family loved this. Thanks for sharing!",
      "Great recipe, but I would reduce the cooking time a bit.",
      "Perfect for a weeknight dinner!",
      "I've made this three times now and it's always a hit.",
      "The flavors are wonderful together.",
      "Simple and delicious!",
      "This has become a staple in our home.",
      "I was skeptical at first, but this turned out fantastic!",
    ];

    const additionalIngredients = [
      "garlic",
      "herbs",
      "paprika",
      "lemon zest",
      "nutmeg",
      "hot sauce",
      "honey",
      "soy sauce",
      "ginger",
      "cinnamon",
    ];

    // Sample author names
    const authorNames = [
      "FoodLover",
      "ChefMaster",
      "HomeCook",
      "CulinaryExpert",
      "RecipeCollector",
      "KitchenWizard",
      "TastyChef",
      "FlavorHunter",
      "GourmetFanatic",
      "CookingEnthusiast",
    ];

    const allComments = [];

    for (const recipe of allRecipes) {
      const commentCount = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < commentCount; i++) {
        const userIndex = Math.floor(Math.random() * allUsers.length);
        const user = allUsers[userIndex];

        let commentText =
          commentTemplates[Math.floor(Math.random() * commentTemplates.length)];

        if (commentText.includes("{ingredient}")) {
          const ingredient =
            additionalIngredients[
              Math.floor(Math.random() * additionalIngredients.length)
            ];
          commentText = commentText.replace("{ingredient}", ingredient);
        }

        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const commentDate = new Date();
        commentDate.setDate(commentDate.getDate() - daysAgo);

        let authorName;
        if (user.username) {
          authorName = user.username;
        } else {
          if (user.email) {
            authorName = user.email.split("@")[0];
          } else {
            authorName =
              authorNames[Math.floor(Math.random() * authorNames.length)];
          }
        }

        allComments.push({
          content: commentText,
          user_id: user.id,
          recipe_id: recipe.id,
          author_name: authorName,
          created_at: commentDate,
        });
      }
    }

    const insertedComments = await db
      .insert(comments)
      .values(allComments)
      .returning({ id: comments.id, content: comments.content });

    console.log(
      `Seeded ${insertedComments.length} comments across ${allRecipes.length} recipes`
    );

    return insertedComments;
  } catch (error) {
    console.error("Error seeding comments:", error);
    throw error;
  }
}

// Run the function if this script is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedComments()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
