import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      const storedEmail = localStorage.getItem("userEmail");
      const storedUsername = localStorage.getItem("username");
      const storedIsAdmin = localStorage.getItem("isAdmin") === "true";

      if (storedEmail) {
        setUserEmail(storedEmail);
      }
      if (storedUsername) {
        setUsername(storedUsername);
      }
      setIsAdmin(storedIsAdmin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="navbar navbar-dark bg-dark p-3">
      <div className="container-fluid">
        <Link href="/" className="text-decoration-none">
          <div className="d-flex align-items-center">
            <img
              src="/images/logo.png"
              alt="RecipeHub Logo"
              width={40}
              height={40}
              className="rounded-circle me-2"
            />
            <span className="navbar-brand mb-0 h1 fw-bold">RecipeHub</span>
          </div>
        </Link>

        <div className="d-flex">
          {isLoggedIn ? (
            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="fw-bold">
                  {username || username}
                  {isAdmin && (
                    <span className="ms-1 badge bg-danger">Admin</span>
                  )}
                </span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <Link href="/addRecipe" className="dropdown-item">
                    Add Recipe
                  </Link>
                </li>
                <li>
                  <Link href="/myRecipes" className="dropdown-item">
                    My Recipes
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link href="/admin" className="dropdown-item text-danger">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="me-2">
                <button className="btn btn-outline-primary fw-bold">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="btn btn-primary fw-bold">Sign-up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
