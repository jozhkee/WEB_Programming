import { useState, useEffect } from "react";
import Link from "next/link";

export default function Comments({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?recipe_id=${recipeId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          content: newComment,
          recipe_id: recipeId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError(error.message || "Failed to post comment");
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-4">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 mb-5 p-4 bg-dark rounded shadow">
      <h2 className="fs-3 mb-4 text-light">Comments</h2>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="form-control bg-dark text-light mb-3"
            required
          />
          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>
      ) : (
        <div className="text-center mb-4">
          <Link href="/login" className="btn btn-primary">
            Log in to post a comment
          </Link>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="card bg-dark mb-3 border-secondary"
            >
              <div className="card-header d-flex justify-content-between flex-wrap">
                <span className="fw-bold text-light">
                  {comment.author_name}
                </span>
                <span className="text-secondary small">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text text-light">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-secondary fst-italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
