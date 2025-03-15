import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/addRecipe.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AddRecipe() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    prepTime: "",
    cookTime: "",
    servings: "",
  });

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
      const response = await fetch("/api/recipes/addRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...recipe,
          ingredients: recipe.ingredients.filter((i) => i.trim()),
          prepTime: parseInt(recipe.prepTime),
          cookTime: parseInt(recipe.cookTime),
          servings: parseInt(recipe.servings),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if data contains a specific error message
        const errorMessage =
          data.error || data.message || "Failed to add recipe";
        throw new Error(errorMessage);
      }

      // Success - clear form and redirect
      setRecipe({
        title: "",
        description: "",
        ingredients: [""],
        instructions: "",
        prepTime: "",
        cookTime: "",
        servings: "",
      });

      router.push(`/recipes/${data.id}`); // Redirect to the new recipe page
    } catch (error) {
      console.error("Error adding recipe:", error);
      setError(
        typeof error === "string"
          ? error
          : error.message || "Failed to add recipe"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Add New Recipe</h1>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="title">
                Recipe Title
              </label>
              <input
                className={styles.input}
                type="text"
                id="title"
                value={recipe.title}
                onChange={(e) =>
                  setRecipe({ ...recipe, title: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <textarea
                className={styles.textArea}
                id="description"
                value={recipe.description}
                onChange={(e) =>
                  setRecipe({ ...recipe, description: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Ingredients</label>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className={styles.ingredientRow}>
                  <input
                    className={styles.input}
                    type="text"
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
                    className={styles.removeButton}
                    disabled={isSubmitting || recipe.ingredients.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredientField}
                className={styles.addButton}
                disabled={isSubmitting}
              >
                Add Ingredient
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="instructions">
                Instructions
              </label>
              <textarea
                className={styles.textArea}
                id="instructions"
                value={recipe.instructions}
                onChange={(e) =>
                  setRecipe({ ...recipe, instructions: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.timeServingsRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="prepTime">
                  Prep Time (min)
                </label>
                <input
                  className={styles.input}
                  type="number"
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

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="cookTime">
                  Cook Time (min)
                </label>
                <input
                  className={styles.input}
                  type="number"
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

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="servings">
                  Servings
                </label>
                <input
                  className={styles.input}
                  type="number"
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
