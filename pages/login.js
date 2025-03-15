import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import styles from "../styles/login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Saving email to localStorage:", email);

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userEmail", email);

        router.push("/");
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className={styles["form-container"]}>
        <h1 className={styles.heading}>Login</h1>
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className={styles["error-message"]}>{error}</p>}
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        <a href="/signup" className={styles["link"]}>
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
}
