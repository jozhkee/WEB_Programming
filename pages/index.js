import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/index.module.css";

export default function Home({ recipes = [] }) {
  return (
    <>
      <Head>
        <title>Recipe Forum</title>
        <meta
          name="description"
          content="A community-driven recipe sharing forum"
        />
      </Head>
      <Header />
      <main className={styles.mainContainer}>
        <h1 className={styles.welcomeTitle}>Welcome to the Recipe Forum!</h1>
        <p className={styles.welcomeText}>
          Share your favorite recipes, discover new dishes, and connect with
          fellow food lovers.
        </p>
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Recipes</h2>
          {recipes && recipes.length > 0 ? (
            <ul className={styles.recipeList}>
              {recipes.map((recipe) => (
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
                        <span>Prep: {recipe.prepTime} mins</span>
                        <span>Cook: {recipe.cookTime} mins</span>
                        <span>Servings: {recipe.servings}</span>
                      </div>
                      <button className={styles.viewButton}>View Recipe</button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noRecipes}>
              No recipes found. Check back soon!
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
