import { db } from "../src/";
import { recipes } from "../src/db/schema";

async function seedDatabase() {
  try {
    await db.insert(recipes).values([
      // Pasta
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
      },

      // Desserts
      {
        title: "Chocolate Cake",
        description: "Rich and moist chocolate cake.",
        ingredients: JSON.stringify(["flour", "cocoa powder", "sugar", "eggs"]),
        instructions: "Mix ingredients. Bake at 180°C for 30 minutes.",
        prep_time: 15,
        cook_time: 30,
        servings: 8,
        category: "Desserts",
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
      },

      // Vegan
      {
        title: "Vegan Buddha Bowl",
        description: "A healthy and colorful vegan bowl.",
        ingredients: JSON.stringify(["quinoa", "chickpeas", "vegetables"]),
        instructions: "Cook quinoa. Assemble with chickpeas and vegetables.",
        prep_time: 15,
        cook_time: 10,
        servings: 1,
        category: "Vegan",
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
      },

      // Salads
      {
        title: "Caesar Salad",
        description: "Crisp romaine lettuce with Caesar dressing and croutons.",
        ingredients: JSON.stringify([
          "romaine lettuce",
          "croutons",
          "parmesan",
          "Caesar dressing",
        ]),
        instructions: "Toss ingredients together and serve.",
        prep_time: 10,
        cook_time: 0,
        servings: 2,
        category: "Salads",
      },
      {
        title: "Greek Salad",
        description: "A refreshing salad with cucumbers, tomatoes, and feta.",
        ingredients: JSON.stringify([
          "cucumbers",
          "tomatoes",
          "feta cheese",
          "olives",
        ]),
        instructions: "Chop vegetables. Toss with feta and olives.",
        prep_time: 10,
        cook_time: 0,
        servings: 4,
        category: "Salads",
      },

      // Sandwiches
      {
        title: "Grilled Cheese Sandwich",
        description: "A classic grilled cheese sandwich.",
        ingredients: JSON.stringify(["bread", "cheese", "butter"]),
        instructions: "Butter bread, add cheese, and grill until golden brown.",
        prep_time: 5,
        cook_time: 5,
        servings: 1,
        category: "Sandwiches",
      },
      {
        title: "Club Sandwich",
        description: "A triple-layer sandwich with turkey, bacon, and lettuce.",
        ingredients: JSON.stringify([
          "bread",
          "turkey",
          "bacon",
          "lettuce",
          "tomato",
        ]),
        instructions: "Layer ingredients between slices of bread.",
        prep_time: 10,
        cook_time: 0,
        servings: 2,
        category: "Sandwiches",
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
