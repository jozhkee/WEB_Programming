import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/header.module.css";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      const storedEmail = localStorage.getItem("userEmail");
      const storedUsername = localStorage.getItem("username");
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(`.${styles.dropdown}`)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    router.push("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <div className={styles.titleContainer}>
          <img
            src="/images/logo.png"
            alt="RecipeHub Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.title}>RecipeHub</span>
        </div>
      </Link>

      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={styles.dropdown}>
              <button
                className={`${styles.button} ${styles.userDropdownButton}`}
                onClick={toggleDropdown}
              >
                {username || userEmail} {isDropdownOpen ? "▲" : "▼"}
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <Link href="/addRecipe">
                    <button className={styles.dropdownItem}>Add Recipe</button>
                  </Link>
                  <Link href="/myRecipes">
                    <button className={styles.dropdownItem}>My Recipes</button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
