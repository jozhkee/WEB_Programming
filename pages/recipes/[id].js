import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Comments from "../../components/Comments";

export default function RecipeDetail({ recipe }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-center text-white p-5">Loading...</div>;
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
      <main className="container bg-dark text-white py-4 px-4 my-4 rounded shadow">
        <Link
          href="/"
          className="d-inline-block mb-4 text-primary text-decoration-none"
        >
          ← Back to all recipes
        </Link>

        <h1 className="mb-3">{recipe.title}</h1>
        <p className="fs-5 fst-italic text-light mb-4">{recipe.description}</p>

        {recipe.image_url && (
          <div className="mb-4">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="img-fluid rounded shadow"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}

        <div
          className="d-flex flex-wrap justify-content-between bg-dark border border-secondary rounded p-3 mb-4 text-light"
          style={{ maxWidth: "500px" }}
        >
          <div className="p-2">
            <strong className="text-white">Prep Time:</strong>
            <br />
            {recipe.prep_time} mins
          </div>
          <div className="p-2">
            <strong className="text-white">Cook Time:</strong>
            <br />
            {recipe.cook_time} mins
          </div>
          <div className="p-2">
            <strong className="text-white">Servings:</strong>
            <br />
            {recipe.servings}
          </div>
          <div className="p-2">
            <strong className="text-white">Category:</strong>
            <br />
            {capitalizeFirstLetter(recipe.category) || "Unknown"}
          </div>
        </div>

        <div className="mb-4 text-light">
          <p>
            <strong>Author:</strong> {recipe.author_name || "Unknown"}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {recipe.created_at
              ? new Date(recipe.created_at).toLocaleDateString()
              : "Unknown date"}
          </p>
        </div>

        <div className="row mt-4">
          <div className="col-md-6 mb-4">
            <h2 className="border-bottom border-secondary pb-2">Ingredients</h2>
            <ul className="text-light mt-3 ps-4">
              {Array.isArray(ingredients) ? (
                ingredients.map((ingredient, index) => (
                  <li key={index} className="mb-2">
                    {ingredient}
                  </li>
                ))
              ) : (
                <li>Ingredients data not available in expected format</li>
              )}
            </ul>
          </div>

          <div className="col-md-6 mb-4">
            <h2 className="border-bottom border-secondary pb-2">
              Instructions
            </h2>
            <div className="text-light mt-3">
              {recipe.instructions
                ? recipe.instructions
                    .split(/\d+\.\s+/)
                    .filter(Boolean)
                    .map((step, index) => (
                      <p key={index} className="mb-3">
                        <span className="text-white">{index + 1}.</span>{" "}
                        {step.trim()}
                      </p>
                    ))
                : "No instructions available"}
            </div>
          </div>
        </div>

        <div className="mt-5">
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
