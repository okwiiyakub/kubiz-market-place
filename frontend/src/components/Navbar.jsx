import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar({ onSearch }) {
  const { cartItems } = useCart();
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { customer, logoutCustomer } = useAuth();

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchText);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  const handleCustomerLogout = () => {
    logoutCustomer();
    closeMenu();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-extrabold text-blue-600 tracking-tight"
          >
            Kubiz Market Place
          </Link>

          <form
            onSubmit={handleSubmit}
            className="hidden md:flex flex-1 max-w-xl"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 rounded-r-xl hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden border border-gray-300 rounded-xl px-4 py-2 font-bold text-gray-700"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>

            {!isAdmin && (
              <>
                <a href="/#products" className="hover:text-blue-600 transition">
                  Products
                </a>

                <a href="/#categories" className="hover:text-blue-600 transition">
                  Categories
                </a>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/dashboard" className="hover:text-blue-600 transition">
                  Dashboard
                </Link>

                <Link to="/admin-products" className="hover:text-blue-600 transition">
                  Admin Products
                </Link>

                <Link to="/admin-orders" className="hover:text-blue-600 transition">
                  Admin Orders
                </Link>

                <Link to="/admin-reports" className="hover:text-blue-600 transition">
                  Reports
                </Link>
              </>
            )}

            <Link to="/cart" className="hover:text-blue-600 transition">
              Cart ({cartItems.length})
            </Link>

            {!isAdmin && customer && (
              <>
                <Link to="/my-orders" className="hover:text-blue-600 transition">
                  My Orders
                </Link>

                <button
                  onClick={handleCustomerLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            )}

            {!isAdmin && !customer && (
              <>
                <Link to="/login" className="hover:text-blue-600 transition">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}

            {isAdmin && (
              <button
                onClick={handleAdminLogout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-5 bg-gray-50 rounded-2xl border border-gray-100 p-5">
            <form onSubmit={handleSubmit} className="flex mb-5">
              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                onClick={closeMenu}
                className="bg-blue-600 text-white px-5 rounded-r-xl hover:bg-blue-700 transition"
              >
                Search
              </button>
            </form>

            <div className="flex flex-col gap-4 text-gray-700 font-medium">
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>

              {!isAdmin && (
                <>
                  <a href="/#products" onClick={closeMenu}>
                    Products
                  </a>

                  <a href="/#categories" onClick={closeMenu}>
                    Categories
                  </a>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/dashboard" onClick={closeMenu}>
                    Dashboard
                  </Link>

                  <Link to="/admin-products" onClick={closeMenu}>
                    Admin Products
                  </Link>

                  <Link to="/admin-orders" onClick={closeMenu}>
                    Admin Orders
                  </Link>

                  <Link to="/admin-reports" onClick={closeMenu}>
                    Reports
                  </Link>
                </>
              )}

              <Link to="/cart" onClick={closeMenu}>
                Cart ({cartItems.length})
              </Link>

              {!isAdmin && customer && (
                <>
                  <Link to="/my-orders" onClick={closeMenu}>
                    My Orders
                  </Link>

                  <button
                    onClick={handleCustomerLogout}
                    className="text-left text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}

              {!isAdmin && !customer && (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-center"
                  >
                    Register
                  </Link>
                </>
              )}

              {isAdmin && (
                <button
                  onClick={handleAdminLogout}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;