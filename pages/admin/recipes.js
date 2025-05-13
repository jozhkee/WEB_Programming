import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function AdminRecipes() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/admin/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Admin access required");
        }

        setIsAdmin(true);
        fetchRecipes(token);
      } catch (err) {
        console.error("Not an admin:", err);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchRecipes = async (token) => {
    try {
      const response = await fetch("/api/admin/recipes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err.message);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (
      !confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete recipe");
      }

      setDeleteMessage("Recipe deleted successfully");
      fetchRecipes(localStorage.getItem("authToken"));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSort = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    let comparison = 0;
    if (sortField === "id") {
      comparison = a.id - b.id;
    } else if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === "category") {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === "author") {
      const authorA = a.author_name || a.userId || "";
      const authorB = b.author_name || b.userId || "";
      comparison = String(authorA).localeCompare(String(authorB));
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container flex-grow-1 text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container flex-grow-1 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Recipe Management</h1>
          <Link href="/admin" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {deleteMessage && (
          <div className="alert alert-success">{deleteMessage}</div>
        )}

        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("id")}
                  style={{ cursor: "pointer" }}
                >
                  ID{" "}
                  {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("title")}
                  style={{ cursor: "pointer" }}
                >
                  Title{" "}
                  {sortField === "title" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("category")}
                  style={{ cursor: "pointer" }}
                >
                  Category{" "}
                  {sortField === "category" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("author")}
                  style={{ cursor: "pointer" }}
                >
                  Author{" "}
                  {sortField === "author" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.id}</td>
                  <td>{recipe.title}</td>
                  <td>{capitalizeFirstLetter(recipe.category)}</td>
                  <td>{recipe.author_name || recipe.userId || "-"}</td>
                  <td>
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="btn btn-sm btn-info me-2"
                    >
                      View
                    </Link>
                    <Link
                      href={`/recipes/edit/${recipe.id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
