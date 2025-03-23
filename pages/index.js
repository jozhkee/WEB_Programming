import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/index.module.css";
import { useState } from "react";

export default function Home({ recipes = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Filter recipes based on the selected category
  const filteredRecipes = selectedCategory
    ? recipes.filter((recipe) => recipe.category === selectedCategory)
    : recipes;

  const categories = [
    "All",
    "Pasta",
    "Desserts",
    "Main Dishes",
    "Vegan",
    "Vegetarian",
    "Salads",
    "Sandwiches",
    "Finger Foods",
    "Soups",
    "Breakfast",
    "Drinks",
  ];

  return (
    <>
      <Head>
        <title>RecipeHub</title>
        <meta
          name="description"
          content="A community-driven recipe sharing forum"
        />
      </Head>
      <Header />
      <main className={styles.mainContainer}>
        <h1 className={styles.welcomeTitle}>Welcome to the RecipeHub!</h1>
        <p className={styles.welcomeText}>
          Share your favorite recipes, discover new dishes, and connect with
          fellow food lovers.
        </p>
        <section className={styles.filterSection}>
          <div className={styles.categoryTabs}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.tabButton} ${
                  (selectedCategory === "" && category === "All") || // Handle "All" explicitly
                  selectedCategory === category.toLowerCase()
                    ? styles.activeTab
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    category === "All" ? "" : category.toLowerCase()
                  )
                }
              >
                {category}
              </button>
            ))}
          </div>
        </section>
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Recipes</h2>
          {filteredRecipes && filteredRecipes.length > 0 ? (
            <ul className={styles.recipeList}>
              {filteredRecipes.map((recipe) => (
                <li key={recipe.id} className={styles.recipeCard}>
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className={styles.recipeLink}
                  >
                    <div>
                      <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                      <p className={styles.recipeDescription}>
                        {recipe.description}
                      </p>
                      <div className={styles.recipeMetadata}>
                        <span>Prep: {recipe.prep_time} mins</span>
                        <span>Cook: {recipe.cook_time} mins</span>
                        <span>Servings: {recipe.servings}</span>
                        <span>
                          Category: {capitalizeFirstLetter(recipe.category)}
                        </span>
                      </div>
                      <button className={styles.viewButton}>View Recipe</button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noRecipes}>
              No recipes found for this category. Try another one!
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

// Fetch data from the API
export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3000/api/recipes");

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const recipes = await res.json();
    return { props: { recipes } };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { props: { recipes: [] } };
  }
}
