import { db } from "../src";
import { recipes, users, categories } from "../src/db/schema";
import { seedUsers } from "./seedUser";
import { seedCategories } from "./seedCategories";
import { faker } from "@faker-js/faker";

export async function seedRecipes() {
  try {
    console.log("Starting to seed recipes...");

    let seededUsers = await db.select().from(users);
    if (seededUsers.length === 0) {
      console.log("No users found. Creating users first...");
      seededUsers = await seedUsers();
    }

    let seededCategories = await db.select().from(categories);
    if (seededCategories.length === 0) {
      console.log("No categories found. Creating categories first...");
      seededCategories = await seedCategories();
    }

    // Store category names for lookup
    const categoryNames = seededCategories.map((c) => c.name);

    /* Check if recipes already exist
    const existingRecipes = await db
      .select({ count: { value: recipes.id } })
      .from(recipes);

    if (existingRecipes[0]?.count?.value > 0) {
      console.log(
        `Found ${existingRecipes[0].count.value} existing recipes. Skipping seeding.`
      );
      return await db.select().from(recipes);
    }*/

    const ingredientsByCategory = {
      pasta: [
        "spaghetti",
        "penne",
        "fettuccine",
        "linguine",
        "olive oil",
        "garlic",
        "tomatoes",
        "basil",
        "parmesan",
        "mozzarella",
        "cream",
        "butter",
        "onion",
        "mushrooms",
        "bell pepper",
        "pancetta",
        "eggs",
        "ground beef",
      ],
      desserts: [
        "flour",
        "sugar",
        "butter",
        "eggs",
        "vanilla extract",
        "chocolate chips",
        "cocoa powder",
        "baking powder",
        "milk",
        "cream",
        "cream cheese",
        "lemon",
        "strawberries",
        "blueberries",
        "cinnamon",
        "nutmeg",
        "apple",
        "peaches",
      ],
      "main dishes": [
        "chicken breast",
        "ground beef",
        "steak",
        "pork chops",
        "salmon",
        "tilapia",
        "garlic",
        "onion",
        "bell peppers",
        "olive oil",
        "salt",
        "pepper",
        "rice",
        "potatoes",
        "carrots",
        "broccoli",
        "lemon",
        "herbs",
      ],
      vegan: [
        "tofu",
        "tempeh",
        "lentils",
        "chickpeas",
        "quinoa",
        "kale",
        "spinach",
        "avocado",
        "nutritional yeast",
        "coconut milk",
        "olive oil",
        "mushrooms",
        "bell peppers",
        "tahini",
        "maple syrup",
        "nuts",
        "flaxseed",
      ],
      vegetarian: [
        "eggs",
        "cheese",
        "milk",
        "butter",
        "tofu",
        "lentils",
        "beans",
        "quinoa",
        "pasta",
        "rice",
        "vegetables",
        "mushrooms",
        "nuts",
        "yogurt",
        "cream",
        "paneer",
      ],
      salads: [
        "lettuce",
        "spinach",
        "arugula",
        "kale",
        "tomatoes",
        "cucumber",
        "bell pepper",
        "red onion",
        "avocado",
        "feta cheese",
        "olives",
        "olive oil",
        "vinegar",
        "lemon juice",
        "herbs",
        "croutons",
        "nuts",
        "seeds",
      ],
      sandwiches: [
        "bread",
        "baguette",
        "ciabatta",
        "turkey",
        "ham",
        "roast beef",
        "cheese",
        "lettuce",
        "tomato",
        "mayo",
        "mustard",
        "avocado",
        "cucumber",
        "sprouts",
        "onion",
        "pickles",
      ],
      "finger foods": [
        "chicken wings",
        "mozzarella sticks",
        "nachos",
        "potato skins",
        "jalapeno poppers",
        "dips",
        "crackers",
        "chips",
        "sliders",
        "spring rolls",
        "stuffed mushrooms",
      ],
      soups: [
        "chicken broth",
        "vegetable broth",
        "beef broth",
        "onion",
        "garlic",
        "carrots",
        "celery",
        "potatoes",
        "tomatoes",
        "beans",
        "pasta",
        "rice",
        "cream",
        "herbs",
        "spices",
        "bay leaf",
      ],
      breakfast: [
        "eggs",
        "bacon",
        "sausage",
        "bread",
        "milk",
        "pancake mix",
        "maple syrup",
        "flour",
        "butter",
        "cheese",
        "vegetables",
        "fruits",
        "yogurt",
        "oats",
        "cereal",
        "coffee",
      ],
      drinks: [
        "milk",
        "yogurt",
        "fruits",
        "ice",
        "honey",
        "sugar",
        "coffee",
        "tea",
        "chocolate",
        "juice",
        "mint",
        "lemon",
        "lime",
        "water",
        "club soda",
        "coconut milk",
      ],
    };

    const allRecipes = [];
    const totalRecipes = 120;

    for (let i = 0; i < totalRecipes; i++) {
      const userId =
        seededUsers[Math.floor(Math.random() * seededUsers.length)].id;

      const category =
        categoryNames[Math.floor(Math.random() * categoryNames.length)];

      const categoryIngredients =
        ingredientsByCategory[category] || ingredientsByCategory["main dishes"];

      const ingredientCount = Math.floor(Math.random() * 7) + 4;
      const ingredients = [];

      const availableIngredients = [...categoryIngredients];
      for (
        let j = 0;
        j < ingredientCount && availableIngredients.length > 0;
        j++
      ) {
        const index = Math.floor(Math.random() * availableIngredients.length);
        ingredients.push(availableIngredients[index]);
        availableIngredients.splice(index, 1);
      }

      const prepTime = Math.floor(Math.random() * 30) + 5;
      const cookTime = Math.floor(Math.random() * 60) + 10;
      const servings = Math.floor(Math.random() * 6) + 1;

      const instructionSteps = Math.floor(Math.random() * 4) + 3;
      let instructions = "";

      for (let step = 1; step <= instructionSteps; step++) {
        instructions += `${step}. ${faker.lorem.sentence()} `;
      }

      allRecipes.push({
        title: faker.lorem
          .words({ min: 2, max: 4 })
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        description: faker.lorem.sentence(),
        ingredients: JSON.stringify(ingredients),
        instructions: instructions.trim(),
        prep_time: prepTime,
        cook_time: cookTime,
        servings: servings,
        category: category,
        user_id: userId,
        created_at: faker.date.past({ years: 1 }),
        image_url: null,
      });
    }

    const insertedRecipes = await db
      .insert(recipes)
      .values(allRecipes)
      .returning();

    console.log(`Successfully seeded ${insertedRecipes.length} recipes`);
    return insertedRecipes;
  } catch (error) {
    console.error("Error seeding recipes:", error);
    throw error;
  }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedRecipes()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
