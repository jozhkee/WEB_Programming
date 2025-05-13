import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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
        fetchUsers(token);
      } catch (err) {
        console.error("Not an admin:", err);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    }
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
        <h1 className="mb-4">Admin Dashboard</h1>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-dark text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">User Management</h5>
                <p className="card-text">Manage users and permissions</p>
                <Link href="/admin/users" className="btn btn-primary">
                  Manage Users
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-dark text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Recipe Management</h5>
                <p className="card-text">Moderate all recipes</p>
                <Link href="/admin/recipes" className="btn btn-primary">
                  Manage Recipes
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-dark text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Comment Management</h5>
                <p className="card-text">Moderate all comments</p>
                <Link href="/admin/comments" className="btn btn-primary">
                  Manage Comments
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-dark text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Category Management</h5>
                <p className="card-text">Manage recipe categories</p>
                <Link href="/admin/categories" className="btn btn-primary">
                  Manage Categories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <h2 className="mb-3">Recent Users</h2>
        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Is Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.is_admin ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn btn-sm btn-danger">Delete</button>
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
