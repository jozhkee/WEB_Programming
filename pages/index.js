import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const recipes = [
    { id: 1, title: 'Spaghetti Carbonara', description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.' },
    { id: 2, title: 'Chicken Tikka Masala', description: 'A flavorful Indian dish with grilled chicken in a creamy tomato sauce.' },
    { id: 3, title: 'Chocolate Chip Cookies', description: 'Crispy on the edges, chewy in the middle, and loaded with chocolate chips.' },
    { id: 4, title: 'Margherita Pizza', description: 'A simple yet delicious pizza with fresh mozzarella, tomatoes, and basil.' },
    { id: 5, title: 'Beef Stroganoff', description: 'A hearty dish of sautéed beef in a creamy mushroom sauce, served over egg noodles.' },
    { id: 6, title: 'Caesar Salad', description: 'A fresh salad with romaine lettuce, croutons, parmesan cheese, and Caesar dressing.' },
    { id: 7, title: 'Shrimp Scampi', description: 'Garlic butter shrimp tossed in a white wine sauce and served over pasta.' },
    { id: 8, title: 'Lemon Herb Chicken', description: 'Juicy grilled chicken marinated with lemon, garlic, and fresh herbs.' },
    { id: 9, title: 'Vegetable Stir Fry', description: 'A mix of fresh vegetables stir-fried in a savory soy-ginger sauce.' },
    { id: 10, title: 'Apple Pie', description: 'A classic American dessert with cinnamon-spiced apples in a flaky crust.' },
  ];
  

  return (
    <>
      <Head>
        <title>Recipe Forum</title>
        <meta name="description" content="A community-driven recipe sharing forum" />
      </Head>
      
      <Header />

      <main style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to the Recipe Forum!</h1>
        <p>Share your favorite recipes, discover new dishes, and connect with fellow food lovers.</p>

        <section style={{ marginTop: '40px' }}>
          <h2>Featured Recipes</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recipes.map((recipe) => (
              <li key={recipe.id} style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
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
