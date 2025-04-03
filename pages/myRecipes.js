import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container flex-grow-1 py-4">
        <h1 className="text-center text-white mb-4">My Recipes</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {recipes.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="col">
                <div className="card h-100 bg-dark text-white border-secondary">
                  <div className="card-body d-flex flex-column">
                    <h3 className="card-title">{recipe.title}</h3>
                    <p className="card-text flex-grow-1">
                      {recipe.description}
                    </p>
                    <div className="mt-2 mb-3">
                      <p className="mb-1">
                        <strong>Prep Time:</strong> {recipe.prep_time} mins
                      </p>
                      <p className="mb-1">
                        <strong>Cook Time:</strong> {recipe.cook_time} mins
                      </p>
                      <p className="mb-1">
                        <strong>Servings:</strong> {recipe.servings}
                      </p>
                      <p className="mb-0">
                        <strong>Category:</strong>{" "}
                        {capitalizeFirstLetter(recipe.category)}
                      </p>
                    </div>
                    <div className="d-grid gap-2">
                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="btn btn-outline-primary"
                      >
                        View Recipe
                      </Link>
                      <Link
                        href={`/recipes/edit/${recipe.id}`}
                        className="btn btn-primary"
                      >
                        Edit Recipe
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white p-5">
            <p className="fs-4">No recipes found.</p>
            <Link href="/addRecipe" className="btn btn-primary mt-3">
              Add Your First Recipe
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
