import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/index.module.css";
import Link from "next/link";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const res = await fetch("/api/userRecipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Failed to fetch recipes: ${errorData.error || res.status}`
          );
        }

        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err.message);
        setError(err.message);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContainer}>
        <h1 className={styles.sectionTitle}>My Recipes</h1>
        {error && <p className={styles.error}>{error}</p>}
        <ul className={styles.recipeList}>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <li key={recipe.id} className={styles.recipeCard}>
                <div className={styles.recipeContent}>
                  <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                  <p className={styles.recipeDescription}>
                    {recipe.description}
                  </p>
                  <div className={styles.recipeMetadata}>
                    <p className={styles.recipeDetails}>
                      <strong>Prep Time:</strong> {recipe.prep_time} mins
                    </p>
                    <p className={styles.recipeDetails}>
                      <strong>Cook Time:</strong> {recipe.cook_time} mins
                    </p>
                    <p className={styles.recipeDetails}>
                      <strong>Servings:</strong> {recipe.servings}
                    </p>
                    <p className={styles.recipeDetails}>
                      <strong>Category:</strong>{" "}
                      {capitalizeFirstLetter(recipe.category)}
                    </p>
                  </div>
                  <Link
                    href={`/recipes/edit/${recipe.id}`}
                    className={styles.viewRecipeButton}
                  >
                    Edit Recipe
                  </Link>
                </div>
              </li>
            ))
          ) : (
            <p className={styles.noRecipes}>No recipes found.</p>
          )}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
