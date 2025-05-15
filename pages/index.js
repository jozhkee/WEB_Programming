import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

export default function Home({ recipes = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
        setIsLoadingCategories(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const filteredRecipes = selectedCategory
    ? recipes.filter((recipe) => recipe.category === selectedCategory)
    : recipes;

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
        <h1 className="text-white mb-4 fw-bold">Welcome to the RecipeHub!</h1>
        <p
          className="text-light mb-5 fs-5 mx-auto"
          style={{ maxWidth: "700px" }}
        >
          Share your favorite recipes, discover new dishes, and connect with
          fellow food lovers.
        </p>
        <section className="mb-4">
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            <button
              key="all"
              className={`btn ${
                selectedCategory === ""
                  ? "btn-primary fw-bold"
                  : "btn-outline-primary fw-bold"
              } m-1`}
              onClick={() => setSelectedCategory("")}
            >
              All
            </button>

            {isLoadingCategories ? (
              <div
                className="spinner-border spinner-border-sm text-light m-3"
                role="status"
              >
                <span className="visually-hidden">Loading categories...</span>
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  className={`btn ${
                    selectedCategory === category.name
                      ? "btn-primary fw-bold"
                      : "btn-outline-primary fw-bold"
                  } m-1`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.display_name}
                </button>
              ))
            )}
          </div>
        </section>
        <section className="mt-5">
          <h2 className="text-white mb-4 fw-bold">Featured Recipes</h2>
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
                      <h3 className="card-title fw-bold">{recipe.title}</h3>
                      <p className="card-text flex-grow-1">
                        {recipe.description}
                      </p>
                      <p className="text-secondary mb-2">
                        By {recipe.author_name || "Unknown"}
                        {recipe.created_at &&
                          ` • ${new Date(
                            recipe.created_at
                          ).toLocaleDateString()}`}
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
