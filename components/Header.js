import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/header.module.css";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
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
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    router.push("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.header}>
      <Link href="/" passHref legacyBehavior>
        <a className={styles.title}>RecipeHub</a>
      </Link>

      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={styles.dropdown}>
              <button
                className={`${styles.button} ${styles.userDropdownButton}`}
                onClick={toggleDropdown}
              >
                {userEmail} {isDropdownOpen ? "▲" : "▼"}
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
