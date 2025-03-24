import { db } from "../src";
import { recipes, users } from "../src/db/schema";
import { seedUsers } from "./seedUser";

const categories = [
  "pasta",
  "desserts",
  "main dishes",
  "vegan",
  "vegetarian",
  "salads",
  "sandwiches",
  "finger foods",
  "soups",
  "breakfast",
  "drinks",
];

export async function seedRecipes() {
  try {
    console.log("Starting to seed recipes...");

    let seededUsers;

    const existingUsers = await db.select().from(users);

    if (existingUsers.length === 0) {
      console.log("No users found. Creating users first...");
      seededUsers = await seedUsers();
    } else {
      console.log(
        "Using existing users:",
        existingUsers.map((u) => u.email).join(", ")
      );
      seededUsers = existingUsers;
    }

    const recipesByCategory = {
      pasta: [
        {
          title: "Spaghetti Carbonara",
          description:
            "A classic Italian pasta dish with eggs, cheese, and bacon.",
          ingredients: JSON.stringify([
            "spaghetti",
            "eggs",
            "cheese",
            "bacon",
            "black pepper",
            "olive oil",
          ]),
          instructions:
            "1. Cook pasta until al dente. 2. Mix eggs, cheese, and pepper in a bowl. 3. Fry bacon until crisp. 4. Toss hot pasta with egg mixture and bacon. 5. Serve immediately with extra cheese.",
          prep_time: 10,
          cook_time: 20,
          servings: 4,
        },
        {
          title: "Penne Arrabbiata",
          description: "Spicy tomato-based pasta dish with a kick of chili.",
          ingredients: JSON.stringify([
            "penne pasta",
            "canned tomatoes",
            "garlic",
            "red chili flakes",
            "fresh basil",
            "olive oil",
            "parmesan",
          ]),
          instructions:
            "1. Cook penne according to package instructions. 2. Sauté garlic and chili in olive oil. 3. Add tomatoes and simmer for 15 minutes. 4. Mix sauce with pasta. 5. Garnish with basil and cheese.",
          prep_time: 5,
          cook_time: 25,
          servings: 2,
        },
      ],
      desserts: [
        {
          title: "Chocolate Cake",
          description:
            "Rich and moist chocolate cake that's perfect for any occasion.",
          ingredients: JSON.stringify([
            "flour",
            "cocoa powder",
            "sugar",
            "eggs",
            "butter",
            "baking powder",
            "vanilla extract",
            "milk",
          ]),
          instructions:
            "1. Preheat oven to 350°F. 2. Mix dry ingredients. 3. Beat butter and sugar, add eggs and vanilla. 4. Gradually add dry ingredients and milk. 5. Bake for 30 minutes until a toothpick comes out clean.",
          prep_time: 15,
          cook_time: 30,
          servings: 8,
        },
        {
          title: "Apple Pie",
          description:
            "Classic American apple pie with a flaky crust and sweet-tart filling.",
          ingredients: JSON.stringify([
            "pie crust",
            "apples",
            "sugar",
            "flour",
            "cinnamon",
            "nutmeg",
            "lemon juice",
            "butter",
          ]),
          instructions:
            "1. Roll out pie dough and line a 9-inch pie dish. 2. Mix sliced apples with sugar, flour, spices, and lemon juice. 3. Fill the pie crust with apple mixture and dot with butter. 4. Cover with top crust, seal edges, and cut vents. 5. Bake at 425°F for 15 minutes, reduce to 350°F and bake for 35 minutes more.",
          prep_time: 30,
          cook_time: 50,
          servings: 8,
        },
      ],
      "main dishes": [
        {
          title: "Grilled Chicken Breast",
          description: "Juicy grilled chicken breast with herbs and lemon.",
          ingredients: JSON.stringify([
            "chicken breasts",
            "olive oil",
            "garlic",
            "lemon",
            "thyme",
            "rosemary",
            "salt",
            "pepper",
          ]),
          instructions:
            "1. Mix olive oil, garlic, lemon juice, and herbs. 2. Marinate chicken for at least 30 minutes. 3. Preheat grill to medium-high. 4. Grill chicken for 6-7 minutes per side until internal temperature reaches 165°F. 5. Let rest for 5 minutes before serving.",
          prep_time: 10,
          cook_time: 15,
          servings: 4,
        },
        {
          title: "Beef Stroganoff",
          description:
            "Tender beef strips in a creamy mushroom sauce served over egg noodles.",
          ingredients: JSON.stringify([
            "beef sirloin",
            "mushrooms",
            "onion",
            "garlic",
            "beef broth",
            "sour cream",
            "egg noodles",
            "butter",
            "flour",
            "Worcestershire sauce",
          ]),
          instructions:
            "1. Sauté beef until browned and set aside. 2. Cook mushrooms and onions until soft. 3. Add flour and cook for 1 minute. 4. Add broth and Worcestershire sauce, simmer until thickened. 5. Stir in sour cream and beef. 6. Serve over cooked egg noodles.",
          prep_time: 20,
          cook_time: 25,
          servings: 4,
        },
      ],
      vegan: [
        {
          title: "Vegan Buddha Bowl",
          description:
            "A nutritious and colorful bowl filled with plant-based goodness.",
          ingredients: JSON.stringify([
            "quinoa",
            "chickpeas",
            "sweet potato",
            "avocado",
            "kale",
            "tahini",
            "lemon juice",
            "olive oil",
            "cumin",
          ]),
          instructions:
            "1. Cook quinoa according to package instructions. 2. Roast chickpeas and sweet potatoes with spices. 3. Massage kale with olive oil and lemon juice. 4. Assemble bowl with quinoa, roasted vegetables, kale, and sliced avocado. 5. Drizzle with tahini dressing.",
          prep_time: 15,
          cook_time: 30,
          servings: 2,
        },
        {
          title: "Vegan Tacos",
          description:
            "Flavorful tacos filled with spiced lentils and fresh vegetables.",
          ingredients: JSON.stringify([
            "corn tortillas",
            "lentils",
            "taco seasoning",
            "red onion",
            "bell peppers",
            "avocado",
            "lime",
            "cilantro",
            "salsa",
          ]),
          instructions:
            "1. Cook lentils with taco seasoning until tender. 2. Warm tortillas according to package instructions. 3. Dice vegetables. 4. Assemble tacos with lentils and vegetables. 5. Top with avocado, cilantro, and salsa.",
          prep_time: 20,
          cook_time: 15,
          servings: 3,
        },
      ],
      vegetarian: [
        {
          title: "Eggplant Parmesan",
          description:
            "Italian classic of breaded eggplant with tomato sauce and cheese.",
          ingredients: JSON.stringify([
            "eggplant",
            "bread crumbs",
            "parmesan cheese",
            "mozzarella cheese",
            "tomato sauce",
            "eggs",
            "flour",
            "basil",
            "olive oil",
          ]),
          instructions:
            "1. Slice eggplant and salt to draw out moisture. 2. Dredge in flour, eggs, and breadcrumbs. 3. Fry until golden brown. 4. Layer in baking dish with sauce and cheese. 5. Bake at 350°F for 35 minutes until bubbly.",
          prep_time: 30,
          cook_time: 45,
          servings: 6,
        },
        {
          title: "Mushroom Risotto",
          description:
            "Creamy Italian rice dish with savory mushrooms and parmesan.",
          ingredients: JSON.stringify([
            "arborio rice",
            "mushrooms",
            "onion",
            "garlic",
            "vegetable broth",
            "white wine",
            "parmesan cheese",
            "butter",
            "olive oil",
            "thyme",
          ]),
          instructions:
            "1. Sauté mushrooms until golden and set aside. 2. Cook onion and garlic in olive oil. 3. Add rice and toast for 2 minutes. 4. Add wine and cook until absorbed. 5. Gradually add hot broth, stirring constantly until rice is creamy. 6. Stir in mushrooms, butter, and cheese.",
          prep_time: 15,
          cook_time: 30,
          servings: 4,
        },
      ],
      salads: [
        {
          title: "Greek Salad",
          description:
            "Fresh Mediterranean salad with vegetables and feta cheese.",
          ingredients: JSON.stringify([
            "cucumber",
            "tomatoes",
            "red onion",
            "bell pepper",
            "kalamata olives",
            "feta cheese",
            "olive oil",
            "red wine vinegar",
            "oregano",
            "salt",
            "pepper",
          ]),
          instructions:
            "1. Chop vegetables into bite-sized pieces. 2. Mix olive oil, vinegar, oregano, salt and pepper for dressing. 3. Combine vegetables in a bowl. 4. Add feta cheese and olives. 5. Drizzle with dressing and toss gently.",
          prep_time: 15,
          cook_time: 0,
          servings: 4,
        },
        {
          title: "Caesar Salad",
          description:
            "Classic salad with romaine lettuce, croutons, and Caesar dressing.",
          ingredients: JSON.stringify([
            "romaine lettuce",
            "parmesan cheese",
            "croutons",
            "eggs",
            "lemon juice",
            "garlic",
            "dijon mustard",
            "anchovies",
            "olive oil",
            "worcestershire sauce",
          ]),
          instructions:
            "1. Whisk egg yolks, lemon juice, garlic, mustard, and anchovies. 2. Slowly add olive oil while whisking. 3. Wash and dry lettuce, tear into bite-sized pieces. 4. Toss lettuce with dressing, cheese, and croutons.",
          prep_time: 20,
          cook_time: 0,
          servings: 4,
        },
      ],
      sandwiches: [
        {
          title: "Club Sandwich",
          description:
            "Triple-decker sandwich with turkey, bacon, lettuce, and tomato.",
          ingredients: JSON.stringify([
            "white bread",
            "turkey",
            "bacon",
            "lettuce",
            "tomato",
            "mayonnaise",
            "mustard",
          ]),
          instructions:
            "1. Toast bread slices. 2. Cook bacon until crisp. 3. Spread mayonnaise and mustard on toast. 4. Layer turkey, bacon, lettuce, and tomato. 5. Top with another slice of toast and repeat layers. 6. Cut into triangles and secure with toothpicks.",
          prep_time: 15,
          cook_time: 10,
          servings: 1,
        },
        {
          title: "Grilled Cheese",
          description:
            "Simple yet perfect sandwich with melted cheese and buttery bread.",
          ingredients: JSON.stringify(["bread", "cheddar cheese", "butter"]),
          instructions:
            "1. Butter the outside of bread slices. 2. Place cheese between bread slices. 3. Cook in a skillet over medium heat until golden brown on both sides and cheese is melted.",
          prep_time: 5,
          cook_time: 10,
          servings: 1,
        },
      ],
      "finger foods": [
        {
          title: "Chicken Wings",
          description: "Crispy baked chicken wings with buffalo sauce.",
          ingredients: JSON.stringify([
            "chicken wings",
            "baking powder",
            "salt",
            "butter",
            "hot sauce",
            "garlic powder",
            "honey",
          ]),
          instructions:
            "1. Pat wings dry and toss with baking powder and salt. 2. Bake at 450°F for 30-35 minutes until crispy. 3. Mix melted butter, hot sauce, garlic powder, and honey. 4. Toss wings in sauce and serve.",
          prep_time: 10,
          cook_time: 35,
          servings: 4,
        },
        {
          title: "Stuffed Mushrooms",
          description:
            "Savory mushroom caps filled with a cheesy breadcrumb mixture.",
          ingredients: JSON.stringify([
            "mushrooms",
            "cream cheese",
            "bread crumbs",
            "garlic",
            "parmesan cheese",
            "parsley",
            "olive oil",
          ]),
          instructions:
            "1. Remove mushroom stems and chop finely. 2. Sauté stems and garlic in olive oil. 3. Mix with cream cheese, bread crumbs, parmesan, and parsley. 4. Fill mushroom caps with mixture. 5. Bake at 350°F for 20 minutes until golden.",
          prep_time: 15,
          cook_time: 20,
          servings: 6,
        },
      ],
      soups: [
        {
          title: "Tomato Soup",
          description:
            "Comforting homemade tomato soup, perfect with grilled cheese.",
          ingredients: JSON.stringify([
            "tomatoes",
            "onion",
            "garlic",
            "vegetable broth",
            "heavy cream",
            "butter",
            "sugar",
            "basil",
            "salt",
            "pepper",
          ]),
          instructions:
            "1. Sauté onion and garlic in butter. 2. Add tomatoes and broth, simmer for 15 minutes. 3. Blend until smooth. 4. Return to pot, add cream, sugar, and basil. 5. Season with salt and pepper to taste.",
          prep_time: 10,
          cook_time: 25,
          servings: 4,
        },
        {
          title: "Chicken Noodle Soup",
          description:
            "Classic comfort soup with tender chicken, vegetables, and egg noodles.",
          ingredients: JSON.stringify([
            "chicken broth",
            "chicken breast",
            "carrots",
            "celery",
            "onion",
            "egg noodles",
            "thyme",
            "bay leaf",
            "salt",
            "pepper",
          ]),
          instructions:
            "1. Cook chicken in broth until done, about 15 minutes. 2. Remove chicken, shred, and return to pot. 3. Add vegetables and herbs, simmer for 10 minutes. 4. Add noodles and cook until tender. 5. Season with salt and pepper.",
          prep_time: 15,
          cook_time: 30,
          servings: 6,
        },
      ],
      breakfast: [
        {
          title: "Avocado Toast",
          description:
            "Simple and nutritious breakfast with creamy avocado on toast.",
          ingredients: JSON.stringify([
            "bread",
            "avocado",
            "lemon juice",
            "red pepper flakes",
            "salt",
            "pepper",
            "eggs optional",
          ]),
          instructions:
            "1. Toast bread until golden. 2. Mash avocado with lemon juice, salt, and pepper. 3. Spread avocado on toast. 4. Top with red pepper flakes and optional fried egg.",
          prep_time: 10,
          cook_time: 5,
          servings: 1,
        },
        {
          title: "Pancakes",
          description:
            "Fluffy homemade pancakes perfect for a weekend breakfast.",
          ingredients: JSON.stringify([
            "flour",
            "baking powder",
            "sugar",
            "salt",
            "milk",
            "eggs",
            "butter",
            "vanilla extract",
            "maple syrup",
          ]),
          instructions:
            "1. Mix dry ingredients in a bowl. 2. Whisk milk, eggs, melted butter, and vanilla in another bowl. 3. Combine wet and dry ingredients until just mixed. 4. Cook spoonfuls on a hot greased griddle until bubbles form, then flip. 5. Serve with maple syrup.",
          prep_time: 10,
          cook_time: 15,
          servings: 4,
        },
      ],
      drinks: [
        {
          title: "Strawberry Smoothie",
          description:
            "Refreshing fruit smoothie with strawberries, banana, and yogurt.",
          ingredients: JSON.stringify([
            "strawberries",
            "banana",
            "yogurt",
            "honey",
            "ice",
            "milk optional",
          ]),
          instructions:
            "1. Add all ingredients to a blender. 2. Blend until smooth. 3. Add more liquid if needed to reach desired consistency. 4. Pour into glasses and serve immediately.",
          prep_time: 5,
          cook_time: 0,
          servings: 2,
        },
        {
          title: "Homemade Lemonade",
          description: "Classic sweet-tart lemonade made from fresh lemons.",
          ingredients: JSON.stringify([
            "lemons",
            "sugar",
            "water",
            "ice",
            "mint optional",
          ]),
          instructions:
            "1. Make simple syrup by dissolving sugar in hot water. 2. Juice lemons. 3. Combine lemon juice and simple syrup in a pitcher. 4. Add cold water and ice. 5. Garnish with lemon slices and mint if desired.",
          prep_time: 15,
          cook_time: 0,
          servings: 6,
        },
      ],
    };

    const allRecipes = [];
    let userIndex = 0;

    for (const category of categories) {
      const recipesForCategory = recipesByCategory[category] || [];

      for (const recipeData of recipesForCategory) {
        const user = seededUsers[userIndex % seededUsers.length];
        userIndex++;

        allRecipes.push({
          ...recipeData,
          category,
          user_id: user.id,
          image_url: null,
        });
      }
    }

    const insertedRecipes = await db
      .insert(recipes)
      .values(allRecipes)
      .returning({
        id: recipes.id,
        title: recipes.title,
        category: recipes.category,
      });

    console.log(
      `Seeded ${insertedRecipes.length} recipes across ${categories.length} categories`
    );

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
