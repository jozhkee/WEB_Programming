import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/header.module.css";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in when component mounts
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);

      // Get user email from localStorage
      const storedEmail = localStorage.getItem("userEmail");
      console.log("Email retrieved from localStorage:", storedEmail);

      if (storedEmail) {
        setUserEmail(storedEmail);
        console.log("Email state set to:", storedEmail);
      } else {
        console.log("No email found in localStorage");
      }
    } else {
      console.log("No auth token found in localStorage");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className={styles.header}>
      {/* Clickable Title without changing style */}
      <Link href="/" passHref legacyBehavior>
        <a className={styles.title}>RecipeHub</a>
      </Link>

      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ marginRight: "10px", whiteSpace: "nowrap" }}>
              Welcome, {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className={`${styles.button} ${styles.login}`}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/login">
              <button className={`${styles.button} ${styles.login}`}>
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className={`${styles.button} ${styles.signup}`}>
                Sign-up
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
