import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import styles from "../styles/signup.module.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Add username state
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate username
    if (!username || username.trim() === "") {
      setError("Username is required.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Store the authentication token, email and username
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("username", username);

        // Redirect to the index page
        router.push("/");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className={styles["form-container"]}>
        <h1 className={styles.heading}>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            className={styles["form-control-dark"]}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles["form-control-dark"]}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className={styles["form-control-dark"]}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className={styles["error-message"]}>{error}</p>}
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
        <a href="/login" className={styles.link}>
          Already have an account? Login
        </a>
      </div>
    </div>
  );
}
