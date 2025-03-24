import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Feed", href: "/feed" },
  { name: "Profile", href: "/profile" },
];

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div>
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <Link to="/" className="nav-brand">
                Soc.AI
              </Link>
              <div className="nav-links">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${
                      location.pathname === item.href ? "active" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <button
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="mobile-menu">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`mobile-menu-link ${
                    location.pathname === item.href ? "active" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
}
