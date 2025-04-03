import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function AdminComments() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

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
        fetchComments(token);
      } catch (err) {
        console.error("Not an admin:", err);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchComments = async (token) => {
    try {
      const response = await fetch("/api/admin/comments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (
      !confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }

      setDeleteMessage("Comment deleted successfully");
      // Refresh the comment list
      fetchComments(localStorage.getItem("authToken"));
    } catch (err) {
      setError(err.message);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <h1>Comment Management</h1>
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
                <th>ID</th>
                <th>Author</th>
                <th>Content</th>
                <th>Recipe</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.author_name}</td>
                  <td
                    style={{
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {comment.content}
                  </td>
                  <td>
                    <Link href={`/recipes/${comment.recipe_id}`}>
                      #{comment.recipe_id}
                    </Link>
                  </td>
                  <td>{formatDate(comment.created_at)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteComment(comment.id)}
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
