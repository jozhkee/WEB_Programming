import { db } from "../src/";
import { recipes, users } from "../src/db/schema";

async function seedDatabase() {
  try {
    // Insert a user and retrieve the created user ID
    const [user] = await db
      .insert(users)
      .values([
        {
          email: "admin@example.com",
          password: "securepassword", // Hash in real apps!
        },
      ])
      .returning({ id: users.id }); // Only return the user ID

    if (!user) {
      throw new Error("Failed to create user.");
    }

    // Insert recipes with the created user ID
    await db.insert(recipes).values([
      {
        title: "Spaghetti Carbonara",
        description:
          "A classic Italian pasta dish with eggs, cheese, and bacon.",
        ingredients: JSON.stringify(["spaghetti", "eggs", "cheese", "bacon"]),
        instructions: "Cook pasta. Mix eggs and cheese. Combine with bacon.",
        prep_time: 10,
        cook_time: 20,
        servings: 4,
        category: "Pasta",
        user_id: user.id,
      },
      {
        title: "Penne Arrabbiata",
        description: "Spicy tomato-based pasta dish.",
        ingredients: JSON.stringify(["penne", "tomato sauce", "chili flakes"]),
        instructions: "Cook pasta. Prepare sauce. Mix together.",
        prep_time: 15,
        cook_time: 15,
        servings: 2,
        category: "Pasta",
        user_id: user.id,
      },
      {
        title: "Chocolate Cake",
        description: "Rich and moist chocolate cake.",
        ingredients: JSON.stringify(["flour", "cocoa powder", "sugar", "eggs"]),
        instructions: "Mix ingredients. Bake at 180°C for 30 minutes.",
        prep_time: 15,
        cook_time: 30,
        servings: 8,
        category: "Desserts",
        user_id: user.id,
      },
      {
        title: "Apple Pie",
        description: "Classic apple pie with a flaky crust.",
        ingredients: JSON.stringify(["apples", "flour", "butter", "sugar"]),
        instructions: "Prepare crust. Fill with apples. Bake until golden.",
        prep_time: 20,
        cook_time: 40,
        servings: 6,
        category: "Desserts",
        user_id: user.id,
      },
      {
        title: "Grilled Chicken Breast",
        description: "Juicy grilled chicken breast with herbs.",
        ingredients: JSON.stringify([
          "chicken breast",
          "olive oil",
          "garlic",
          "herbs",
        ]),
        instructions: "Marinate chicken. Grill until fully cooked.",
        prep_time: 10,
        cook_time: 15,
        servings: 2,
        category: "Main Dishes",
        user_id: user.id,
      },
      {
        title: "Beef Stroganoff",
        description: "Tender beef strips in a creamy mushroom sauce.",
        ingredients: JSON.stringify(["beef", "mushrooms", "cream", "onions"]),
        instructions: "Cook beef. Prepare sauce. Combine and serve.",
        prep_time: 15,
        cook_time: 25,
        servings: 4,
        category: "Main Dishes",
        user_id: user.id,
      },
      {
        title: "Vegan Buddha Bowl",
        description: "A healthy and colorful vegan bowl.",
        ingredients: JSON.stringify(["quinoa", "chickpeas", "vegetables"]),
        instructions: "Cook quinoa. Assemble with chickpeas and vegetables.",
        prep_time: 15,
        cook_time: 10,
        servings: 1,
        category: "Vegan",
        user_id: user.id,
      },
      {
        title: "Vegan Tacos",
        description: "Tacos filled with spiced lentils and fresh veggies.",
        ingredients: JSON.stringify(["tortillas", "lentils", "vegetables"]),
        instructions: "Cook lentils. Assemble tacos with veggies.",
        prep_time: 20,
        cook_time: 15,
        servings: 3,
        category: "Vegan",
        user_id: user.id,
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
