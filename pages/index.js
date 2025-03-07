// pages/index.js
import Link from 'next/link';

export default function Home() {
  const recipes = [
    { id: 1, title: 'Spaghetti Carbonara', ingredients: 'Spaghetti, eggs, cheese, pancetta' },
    { id: 2, title: 'Chicken Curry', ingredients: 'Chicken, curry powder, coconut milk' },
    { id: 3, title: 'Vegetable Stir Fry', ingredients: 'Mixed vegetables, soy sauce, garlic' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Recipe Forum</h1>
      <p className="text-lg mb-8 text-center text-gray-600">Welcome to the Recipe Forum! Check out some delicious recipes below.</p>

      <div className="recipe-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{recipe.title}</h2>
            <p className="text-gray-600 mb-4">{recipe.ingredients}</p>
            {/* Correct Link usage */}
            <Link href={`/recipe/${recipe.id}`} className="text-blue-500 hover:underline">
              View Recipe
            </Link>
          </div>
        ))}
      </div>

      {/* Button to add a new recipe */}
      <div className="text-center mt-8">
        <Link href="/add-recipe" className="inline-block bg-green-500 text-white py-3 px-6 rounded-full hover:bg-green-600 transition-colors duration-300 font-semibold">
          Add New Recipe
        </Link>
      </div>
    </div>
  );
}
