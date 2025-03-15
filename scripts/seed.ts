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
        description: "Creamy Alfredo sauce with parmesan and garlic, served over penne pasta.",
        ingredients: JSON.stringify([
          "1 pound penne pasta",
          "2 cups heavy cream",
          "1/2 cup butter",
          "2 cups freshly grated Parmesan cheese",
          "4 cloves garlic, minced",
          "Salt and pepper to taste",
          "Fresh parsley for garnish"
        ]),
        instructions: "1. Cook pasta according to package directions. 2. In a large skillet, melt butter and sauté garlic until fragrant. 3. Add heavy cream and bring to a simmer. 4. Gradually whisk in Parmesan cheese until melted and sauce is smooth. 5. Season with salt and pepper. 6. Toss with cooked pasta and garnish with parsley.",
        prepTime: 10,
        cookTime: 20,
        servings: 4
      },
      {
        title: "Lemon Garlic Shrimp",
        description: "Shrimp sautéed in garlic and lemon butter sauce, served with fresh herbs.",
        ingredients: JSON.stringify([
          "1 pound large shrimp, peeled and deveined",
          "4 tablespoons butter",
          "6 cloves garlic, minced",
          "1/4 cup lemon juice",
          "2 tablespoons olive oil",
          "1/4 cup chopped fresh parsley",
          "1/2 teaspoon red pepper flakes",
          "Salt and pepper to taste"
        ]),
        instructions: "1. In a large skillet, heat olive oil and 2 tablespoons butter over medium-high heat. 2. Add shrimp and cook for 1-2 minutes per side until pink. 3. Remove shrimp and set aside. 4. Add remaining butter and garlic to the pan and cook until fragrant. 5. Add lemon juice and red pepper flakes, simmer for 2 minutes. 6. Return shrimp to the pan, toss to coat, and cook for another minute. 7. Garnish with fresh parsley.",
        prepTime: 15,
        cookTime: 10,
        servings: 4
      },
      {
        title: "Vegetable Stir-Fry",
        description: "A colorful mix of stir-fried vegetables with soy sauce and sesame oil.",
        ingredients: JSON.stringify([
          "2 bell peppers, sliced",
          "1 carrot, julienned",
          "1 cup broccoli florets",
          "1 cup snow peas",
          "1 onion, sliced",
          "3 cloves garlic, minced",
          "1 tablespoon ginger, minced",
          "3 tablespoons soy sauce",
          "1 tablespoon sesame oil",
          "2 tablespoons vegetable oil",
          "1 tablespoon cornstarch mixed with 2 tablespoons water"
        ]),
        instructions: "1. Heat vegetable oil in a wok or large skillet over high heat. 2. Add garlic and ginger, stir for 30 seconds. 3. Add onions and carrots, stir-fry for 2 minutes. 4. Add remaining vegetables and stir-fry for 3-4 minutes until crisp-tender. 5. Pour in soy sauce and sesame oil. 6. Add cornstarch slurry and cook until sauce thickens. 7. Serve hot.",
        prepTime: 20,
        cookTime: 10,
        servings: 4
      },
      {
        title: "BBQ Ribs",
        description: "Tender pork ribs slow-cooked with smoky BBQ sauce, served with coleslaw.",
        ingredients: JSON.stringify([
          "2 racks pork ribs",
          "1/4 cup brown sugar",
          "2 tablespoons paprika",
          "1 tablespoon garlic powder",
          "1 tablespoon onion powder",
          "1 teaspoon cayenne pepper",
          "Salt and pepper to taste",
          "1 cup BBQ sauce"
        ]),
        instructions: "1. Preheat oven to 275°F. 2. Mix brown sugar, paprika, garlic powder, onion powder, cayenne, salt, and pepper to create a dry rub. 3. Remove membrane from backside of ribs and apply dry rub generously on both sides. 4. Wrap ribs tightly in foil and place on a baking sheet. 5. Bake for 2.5-3 hours until tender. 6. Unwrap ribs, brush with BBQ sauce, and broil for 5 minutes. 7. Let rest before serving.",
        prepTime: 20,
        cookTime: 195,
        servings: 6
      },
      {
        title: "Chicken Caesar Salad",
        description: "Crisp romaine lettuce topped with grilled chicken, croutons, and Caesar dressing.",
        ingredients: JSON.stringify([
          "2 chicken breasts",
          "2 heads romaine lettuce, chopped",
          "1 cup croutons",
          "1/2 cup grated Parmesan cheese",
          "1/3 cup Caesar dressing",
          "1 tablespoon olive oil",
          "Salt and pepper to taste",
          "Lemon wedges for serving"
        ]),
        instructions: "1. Season chicken breasts with salt and pepper. 2. Heat olive oil in a skillet over medium-high heat. 3. Cook chicken for 6-7 minutes per side until internal temperature reaches 165°F. 4. Let chicken rest for 5 minutes, then slice. 5. In a large bowl, toss romaine lettuce with Caesar dressing. 6. Top with sliced chicken, croutons, and Parmesan cheese. 7. Serve with lemon wedges.",
        prepTime: 15,
        cookTime: 15,
        servings: 4
      },
      {
        title: "Beef Tacos",
        description: "Ground beef seasoned with Mexican spices, served in soft tortillas with salsa and avocado.",
        ingredients: JSON.stringify([
          "1 pound ground beef",
          "1 packet taco seasoning (or homemade blend)",
          "8 soft tortillas",
          "1 cup shredded lettuce",
          "1 cup diced tomatoes",
          "1/2 cup diced onion",
          "1 cup shredded cheese",
          "1 avocado, sliced",
          "Salsa and sour cream for serving"
        ]),
        instructions: "1. Brown ground beef in a skillet over medium heat until no longer pink. 2. Drain excess fat and add taco seasoning and 2/3 cup water. 3. Simmer for 5 minutes until liquid reduces. 4. Warm tortillas according to package instructions. 5. Assemble tacos by filling tortillas with beef, lettuce, tomatoes, onions, cheese, and avocado. 6. Serve with salsa and sour cream.",
        prepTime: 15,
        cookTime: 15,
        servings: 4
      },
      {
        title: "Pulled Pork Sandwiches",
        description: "Slow-cooked pulled pork with tangy BBQ sauce, served on a soft bun.",
        ingredients: JSON.stringify([
          "4 pound pork shoulder",
          "2 tablespoons brown sugar",
          "2 tablespoons paprika",
          "1 tablespoon garlic powder",
          "1 tablespoon onion powder",
          "1 teaspoon cayenne pepper",
          "1 cup BBQ sauce",
          "1/2 cup chicken broth",
          "8 hamburger buns",
          "Coleslaw for serving"
        ]),
        instructions: "1. Mix brown sugar, paprika, garlic powder, onion powder, cayenne to create a dry rub. 2. Apply rub generously to pork shoulder. 3. Place in slow cooker with chicken broth. 4. Cook on low for 8 hours until fork-tender. 5. Shred pork with two forks and mix with BBQ sauce. 6. Serve on hamburger buns topped with coleslaw.",
        prepTime: 15,
        cookTime: 480,
        servings: 8
      },
      {
        title: "Vegetable Lasagna",
        description: "Layers of pasta, ricotta cheese, spinach, and marinara sauce, baked to perfection.",
        ingredients: JSON.stringify([
          "12 lasagna noodles",
          "2 cups ricotta cheese",
          "2 cups shredded mozzarella cheese",
          "1/2 cup grated Parmesan cheese",
          "2 cups fresh spinach, chopped",
          "1 zucchini, sliced",
          "1 bell pepper, diced",
          "1 onion, diced",
          "3 cups marinara sauce",
          "2 eggs",
          "2 tablespoons olive oil",
          "2 cloves garlic, minced",
          "Salt and pepper to taste",
          "1 teaspoon Italian seasoning"
        ]),
        instructions: "1. Preheat oven to 375°F. 2. Cook lasagna noodles according to package directions. 3. In a skillet, sauté onion, garlic, zucchini, and bell pepper in olive oil until tender. 4. In a bowl, mix ricotta, eggs, spinach, and Italian seasoning. 5. In a 9x13 baking dish, spread 1/2 cup marinara sauce. 6. Layer noodles, ricotta mixture, vegetables, sauce, and cheese. Repeat layers. 7. Cover with foil and bake for 25 minutes. 8. Remove foil and bake for 10 more minutes until bubbly. 9. Let stand for 10 minutes before serving.",
        prepTime: 30,
        cookTime: 45,
        servings: 8
      },
      {
        title: "Fish Tacos",
        description: "Grilled fish fillets in soft tortillas, topped with cabbage slaw and a creamy sauce.",
        ingredients: JSON.stringify([
          "1.5 pounds white fish fillets (cod, tilapia, or mahi-mahi)",
          "8 small tortillas",
          "2 tablespoons olive oil",
          "1 tablespoon lime juice",
          "1 teaspoon chili powder",
          "1/2 teaspoon cumin",
          "1/2 teaspoon garlic powder",
          "Salt and pepper to taste",
          "2 cups shredded cabbage",
          "1/4 cup cilantro, chopped",
          "1/2 cup sour cream",
          "2 tablespoons mayonnaise",
          "1 tablespoon lime juice",
          "1 avocado, sliced",
          "Lime wedges for serving"
        ]),
        instructions: "1. Mix olive oil, lime juice, chili powder, cumin, garlic powder, salt, and pepper. 2. Coat fish with mixture and let marinate for 15 minutes. 3. Grill fish for 3-4 minutes per side until it flakes easily. 4. Mix cabbage and cilantro for slaw. 5. Combine sour cream, mayonnaise, and lime juice for sauce. 6. Warm tortillas. 7. Assemble tacos with fish, slaw, sauce, and avocado slices. 8. Serve with lime wedges.",
        prepTime: 20,
        cookTime: 10,
        servings: 4
      },
      {
        title: "Pumpkin Soup",
        description: "A creamy, comforting soup made with pureed pumpkin, onions, and spices.",
        ingredients: JSON.stringify([
          "4 cups pumpkin puree (fresh or canned)",
          "1 onion, chopped",
          "2 cloves garlic, minced",
          "4 cups vegetable broth",
          "1 cup heavy cream",
          "2 tablespoons olive oil",
          "1 teaspoon ground cinnamon",
          "1/2 teaspoon nutmeg",
          "1/2 teaspoon ground ginger",
          "Salt and pepper to taste",
          "Pumpkin seeds for garnish"
        ]),
        instructions: "1. Heat olive oil in a large pot over medium heat. 2. Sauté onion and garlic until soft, about 5 minutes. 3. Add pumpkin puree, vegetable broth, cinnamon, nutmeg, and ginger. 4. Bring to a simmer and cook for 15 minutes. 5. Use an immersion blender to puree until smooth. 6. Stir in heavy cream and heat through. 7. Season with salt and pepper. 8. Serve garnished with toasted pumpkin seeds.",
        prepTime: 15,
        cookTime: 25,
        servings: 6
      },
    ]);

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

seed().then(() => process.exit());