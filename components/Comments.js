import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/comments.module.css";

export default function Comments({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
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
    return <div className={styles.loading}>Loading comments...</div>;
  }

  return (
    <div className={styles.commentsContainer}>
      <h2 className={styles.title}>Comments</h2>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className={styles.commentInput}
            required
          />
          <button type="submit" className={styles.submitButton}>
            Post Comment
          </button>
        </form>
      ) : (
        <div className={styles.loginPrompt}>
          <Link href="/login" className={styles.loginLink}>
            Log in to post a comment
          </Link>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.commentsList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <span className={styles.authorName}>{comment.author_name}</span>
                <span className={styles.commentDate}>
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
            </div>
          ))
        ) : (
          <p className={styles.noComments}>
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
