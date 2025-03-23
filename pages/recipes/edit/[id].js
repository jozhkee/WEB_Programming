import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import styles from "../../../styles/addRecipe.module.css";

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

          // Convert ingredients string to array if necessary
          const ingredientsArray = Array.isArray(data.ingredients)
            ? data.ingredients
            : typeof data.ingredients === "string"
            ? data.ingredients.split("\n").filter((item) => item.trim())
            : JSON.parse(data.ingredients);

          setRecipe({
            title: data.title || "",
            description: data.description || "",
            ingredients: ingredientsArray.length ? ingredientsArray : [""],
            instructions: data.instructions || "",
            // Handle potential different naming between back-end and front-end
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

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.loadingContainer}>Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Edit Recipe</h1>
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

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="category">
                Category
              </label>
              <select
                className={styles.input}
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

            <div className={styles.timeServingsRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="prep_time">
                  Prep Time (min)
                </label>
                <input
                  className={styles.input}
                  type="number"
                  id="prep_time"
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
                <label className={styles.label} htmlFor="cook_time">
                  Cook Time (min)
                </label>
                <input
                  className={styles.input}
                  type="number"
                  id="cook_time"
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
              a
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
