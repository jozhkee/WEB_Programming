import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function EditRecipe() {
  const router = useRouter();
  const { id } = router.query;

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    category: categories[0],
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  useEffect(() => {
    if (id && isLoggedIn) {
      const fetchRecipe = async () => {
        try {
          const res = await fetch(`/api/recipes/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch recipe");
          }

          const data = await res.json();

          // Updated ingredients parsing logic
          let ingredientsArray;
          try {
            if (Array.isArray(data.ingredients)) {
              ingredientsArray = data.ingredients;
            } else if (typeof data.ingredients === "string") {
              // Handle double-encoded JSON string
              let parsed = data.ingredients;
              while (typeof parsed === "string") {
                try {
                  parsed = JSON.parse(parsed);
                } catch {
                  break;
                }
              }
              ingredientsArray = Array.isArray(parsed) ? parsed : [parsed];
            } else {
              ingredientsArray = [""];
            }
          } catch (e) {
            console.error("Error parsing ingredients:", e);
            ingredientsArray = [""];
          }

          setRecipe({
            title: data.title || "",
            description: data.description || "",
            ingredients: ingredientsArray.filter(
              (ing) => ing && ing.trim()
            ) || [""],
            instructions: data.instructions || "",
            prepTime: data.prep_time || data.prepTime || "",
            cookTime: data.cook_time || data.cookTime || "",
            servings: data.servings || "",
            category: data.category || categories[0],
          });
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [id, isLoggedIn]);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredientField = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const removeIngredientField = (index) => {
    if (recipe.ingredients.length > 1) {
      const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
      setRecipe({ ...recipe, ingredients: newIngredients });
    }
  };

  const validateForm = () => {
    if (!recipe.title.trim()) return "Recipe title is required";
    if (!recipe.description.trim()) return "Description is required";
    if (!recipe.instructions.trim()) return "Instructions are required";
    if (recipe.ingredients.every((i) => !i.trim()))
      return "At least one ingredient is required";
    if (isNaN(recipe.prepTime) || recipe.prepTime < 0)
      return "Valid prep time is required";
    if (isNaN(recipe.cookTime) || recipe.cookTime < 0)
      return "Valid cook time is required";
    if (isNaN(recipe.servings) || recipe.servings < 1)
      return "Valid number of servings is required";
    return null;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/recipes/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients.filter((i) => i.trim()),
          instructions: recipe.instructions,
          prep_time: parseInt(recipe.prepTime),
          cook_time: parseInt(recipe.cookTime),
          servings: parseInt(recipe.servings),
          category: recipe.category.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update recipe");
      }

      router.push(`/recipes/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      setError(error.message || "Failed to update recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/recipes/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete recipe");
      }

      router.push("/myRecipes");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setError(error.message || "Failed to delete recipe");
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container text-center text-white p-5">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <style jsx global>{`
        .form-control,
        .form-select {
          color: white !important;
          background-color: #212529 !important;
          border-color: #495057 !important;
        }
        .form-control::placeholder,
        .form-select::placeholder {
          color: #adb5bd !important;
        }
        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25) !important;
        }
        .form-select option {
          background-color: #212529;
          color: white;
        }
      `}</style>
      <main className="container flex-grow-1 py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card bg-dark text-white shadow">
              <div className="card-body p-4">
                <h1 className="text-center mb-4">Edit Recipe</h1>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Recipe Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={recipe.title}
                      onChange={(e) =>
                        setRecipe({ ...recipe, title: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      value={recipe.description}
                      onChange={(e) =>
                        setRecipe({ ...recipe, description: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ingredients</label>
                    {recipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={ingredient}
                          onChange={(e) =>
                            handleIngredientChange(index, e.target.value)
                          }
                          placeholder="Enter ingredient"
                          required
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredientField(index)}
                          className="btn btn-danger"
                          disabled={
                            isSubmitting || recipe.ingredients.length === 1
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addIngredientField}
                      className="btn btn-success mt-2"
                      disabled={isSubmitting}
                    >
                      Add Ingredient
                    </button>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="instructions" className="form-label">
                      Instructions
                    </label>
                    <textarea
                      className="form-control"
                      id="instructions"
                      rows="5"
                      value={recipe.instructions}
                      onChange={(e) =>
                        setRecipe({ ...recipe, instructions: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      value={recipe.category}
                      onChange={(e) =>
                        setRecipe({ ...recipe, category: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {capitalizeFirstLetter(category)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="prepTime" className="form-label">
                        Prep Time (min)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="prepTime"
                        min="0"
                        value={recipe.prepTime}
                        onChange={(e) =>
                          setRecipe({ ...recipe, prepTime: e.target.value })
                        }
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="cookTime" className="form-label">
                        Cook Time (min)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="cookTime"
                        min="0"
                        value={recipe.cookTime}
                        onChange={(e) =>
                          setRecipe({ ...recipe, cookTime: e.target.value })
                        }
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="servings" className="form-label">
                        Servings
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="servings"
                        min="1"
                        value={recipe.servings}
                        onChange={(e) =>
                          setRecipe({ ...recipe, servings: e.target.value })
                        }
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-between">
                    <button
                      type="submit"
                      className="btn btn-primary py-2 px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving Changes..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger py-2 px-4"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Deleting..." : "Delete Recipe"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
