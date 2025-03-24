import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Comments from "../../components/Comments";
import styles from "../../styles/recipeDetail.module.css";

export default function RecipeDetail({ recipe }) {
  const router = useRouter();

  // Show loading state if fallback
  if (router.isFallback) {
    return <div className={styles.loadingMessage}>Loading...</div>;
  }

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Handle ingredients based on whether it's a string or already an object
  const ingredients =
    typeof recipe.ingredients === "string"
      ? JSON.parse(recipe.ingredients)
      : recipe.ingredients;

  return (
    <>
      <Head>
        <title>{recipe.title} | Recipe Forum</title>
        <meta name="description" content={recipe.description} />
      </Head>
      <Header />
      <main className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to all recipes
        </Link>

        <h1 className={styles.recipeTitle}>{recipe.title}</h1>
        <p className={styles.recipeDescription}>{recipe.description}</p>

        <div className={styles.metadataContainer}>
          <div>
            <strong className={styles.metadataLabel}>Prep Time:</strong>
            <br />
            {recipe.prep_time} mins
          </div>
          <div>
            <strong className={styles.metadataLabel}>Cook Time:</strong>
            <br />
            {recipe.cook_time} mins
          </div>
          <div>
            <strong className={styles.metadataLabel}>Servings:</strong>
            <br />
            {recipe.servings}
          </div>
          <div>
            <strong className={styles.metadataLabel}>Category:</strong>
            <br />
            {capitalizeFirstLetter(recipe.category) || "Unknown"}
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
            <ul className={styles.ingredientsList}>
              {Array.isArray(ingredients) ? (
                ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))
              ) : (
                <li>Ingredients data not available in expected format</li>
              )}
            </ul>
          </div>

          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Instructions</h2>
            <div className={styles.instructions}>
              {recipe.instructions
                ? recipe.instructions.split(". ").map((step, index) => (
                    <p key={index} className={styles.instructionStep}>
                      <strong className={styles.stepNumber}>
                        {index + 1}.
                      </strong>{" "}
                      {step.trim()}.
                    </p>
                  ))
                : "No instructions available"}
            </div>
          </div>
        </div>

        <div className={styles.commentsSection}>
          <Comments recipeId={recipe.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}

// Fetch data for specific recipe
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`http://localhost:3000/api/recipes/${params.id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch recipe: ${res.status}`);
    }

    const recipe = await res.json();

    return {
      props: { recipe },
    };
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return {
      notFound: true,
    };
  }
}
