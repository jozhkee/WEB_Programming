import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import styles from "../../../styles/index.module.css";

export default function EditRecipe() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    category: "",
    ingredients: [],
    instructions: [],
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const res = await fetch(`/api/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const data = await res.json();
      setRecipe(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipe),
      });

      if (!res.ok) {
        throw new Error("Failed to update recipe");
      }

      setMessage("Recipe updated successfully!");
      router.push("/myRecipes");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContainer}>
        <h1 className={styles.sectionTitle}>Edit Recipe</h1>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={recipe.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={recipe.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="prepTime">Prep Time (mins)</label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                value={recipe.prepTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cookTime">Cook Time (mins)</label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                value={recipe.cookTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="servings">Servings</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={recipe.servings}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={recipe.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.editRecipeButton}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
