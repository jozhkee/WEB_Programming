import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function AdminUsers() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
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

  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This will delete all their recipes and comments as well."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      setDeleteMessage("User deleted successfully");
      fetchUsers(localStorage.getItem("authToken"));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAdminStatus = async (userId, isCurrentlyAdmin) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggleAdmin`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_admin: !isCurrentlyAdmin }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update admin status");
      }

      fetchUsers(localStorage.getItem("authToken"));
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

  const sortedUsers = [...users].sort((a, b) => {
    let comparison = 0;
    if (sortField === "id") {
      comparison = a.id - b.id;
    } else if (sortField === "username") {
      comparison = a.username.localeCompare(b.username);
    } else if (sortField === "email") {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === "is_admin") {
      comparison = a.is_admin === b.is_admin ? 0 : a.is_admin ? 1 : -1;
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
      <main className="container flex-grow-1 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>User Management</h1>
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
                  onClick={() => handleSort("username")}
                  style={{ cursor: "pointer" }}
                >
                  Username{" "}
                  {sortField === "username" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  Email{" "}
                  {sortField === "email" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("is_admin")}
                  style={{ cursor: "pointer" }}
                >
                  Admin Status{" "}
                  {sortField === "is_admin" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`admin-toggle-${user.id}`}
                        checked={user.is_admin}
                        onChange={() =>
                          toggleAdminStatus(user.id, user.is_admin)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`admin-toggle-${user.id}`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </label>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
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
