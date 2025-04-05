import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function AdminCategories() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: "",
    display_name: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    // Check if the user is an admin
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
        fetchCategories(token);
      } catch (err) {
        console.error("Not an admin:", err);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchCategories = async (token) => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    }
  };

  const handleSort = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? Any recipes using this category will need to be reassigned."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      setSuccessMessage("Category deleted successfully");
      fetchCategories(localStorage.getItem("authToken"));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Simple validation
    if (!newCategory.name.trim() || !newCategory.display_name.trim()) {
      setError("Both name and display name are required");
      return;
    }

    try {
      const response = await fetch("/api/admin/categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      setSuccessMessage("Category added successfully");
      setNewCategory({ name: "", display_name: "" });
      fetchCategories(localStorage.getItem("authToken"));
    } catch (err) {
      setError(err.message);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    let comparison = 0;
    if (sortField === "id") {
      comparison = a.id - b.id;
    } else if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "display_name") {
      comparison = a.display_name.localeCompare(b.display_name);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

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
      <style jsx global>{`
        .form-control,
        .form-select {
          color: white !important;
          background-color: #212529 !important;
          border-color: #495057 !important;
        }
        .form-control::placeholder,
        .form-select::placeholder {
          color: #adb5bd !important;
        }
        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25) !important;
        }
        .form-select option {
          background-color: #212529;
          color: white;
        }
        .form-text {
          color: #adb5bd !important;
        }
      `}</style>
      <main className="container flex-grow-1 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Category Management</h1>
          <Link href="/admin" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card bg-dark text-white">
              <div className="card-header">
                <h5 className="mb-0">Add New Category</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddCategory}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name (stored value)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={newCategory.name}
                      onChange={handleInputChange}
                      placeholder="e.g. vegan, desserts"
                      required
                    />
                    <small className="form-text text-muted">
                      Used as identifier (lowercase, no spaces recommended)
                    </small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="display_name" className="form-label">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="display_name"
                      name="display_name"
                      value={newCategory.display_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Vegan, Desserts"
                      required
                    />
                    <small className="form-text text-muted">
                      Shown to users
                    </small>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add Category
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-3">Existing Categories</h2>
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
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Name{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("display_name")}
                  style={{ cursor: "pointer" }}
                >
                  Display Name{" "}
                  {sortField === "display_name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.display_name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteCategory(category.id)}
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
