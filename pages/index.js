import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Home({ recipes = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="d-flex flex-column min-vh-100">
      <Head>
        <title>Recipe App</title>
        <meta
          name="description"
          content="Find and save your favorite recipes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="container flex-grow-1 py-4 text-center">
        <h1 className="text-white mb-4">Welcome to the RecipeHub!</h1>
        <p
          className="text-light mb-5 fs-5 mx-auto"
          style={{ maxWidth: "700px" }}
        >
          Share your favorite recipes, discover new dishes, and connect with
          fellow food lovers.
        </p>
        <section className="mb-4">
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${
                  (selectedCategory === "" && category === "All") ||
                  selectedCategory === category.toLowerCase()
                    ? "btn-primary fw-bold"
                    : "btn-outline-primary fw-bold"
                } m-1`}
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
        <section className="mt-5">
          <h2 className="text-white mb-4">Featured Recipes</h2>
          {loading ? (
            <p>Loading recipes...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredRecipes.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="col">
                  <div className="card h-100 bg-dark text-white border-secondary">
                    <div className="card-body d-flex flex-column">
                      <h3 className="card-title">{recipe.title}</h3>
                      <p className="card-text flex-grow-1">
                        {recipe.description}
                      </p>
                      <div className="d-flex flex-wrap justify-content-between mb-3">
                        <span className="badge bg-secondary m-1">
                          Prep: {recipe.prep_time} mins
                        </span>
                        <span className="badge bg-secondary m-1">
                          Cook: {recipe.cook_time} mins
                        </span>
                        <span className="badge bg-secondary m-1">
                          Servings: {recipe.servings}
                        </span>
                        <span className="badge bg-secondary m-1">
                          Category: {capitalizeFirstLetter(recipe.category)}
                        </span>
                      </div>
                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="text-decoration-none"
                      >
                        <button className="btn btn-primary w-100">
                          View Recipe
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No recipes found in this category.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
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
