import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home({ recipes }) {
  return (
    <>
      <Head>
        <title>Recipe Forum</title>
        <meta name="description" content="A community-driven recipe sharing forum" />
      </Head>

      <Header />

      <main style={{ padding: "20px", textAlign: "center" }}>
        <h1>Welcome to the Recipe Forum!</h1>
        <p>Share your favorite recipes, discover new dishes, and connect with fellow food lovers.</p>

        <section style={{ marginTop: "40px" }}>
          <h2>Featured Recipes</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                style={{
                  margin: "20px 0",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}

// Fetch data from the API
export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/recipes");
  const recipes = await res.json();

  return { props: { recipes } };
}
