import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar({ onSearch }) {
  const { cartItems } = useCart();
  const [searchText, setSearchText] = useState("");

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchText);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-600 tracking-tight"
        >
          Kubiz Market Place
        </Link>

        <form onSubmit={handleSubmit} className="flex flex-1 max-w-xl">
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

        <div className="flex items-center gap-6 text-gray-700 font-medium">
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
            </>
          )}

          <Link to="/cart" className="hover:text-blue-600 transition">
            Cart ({cartItems.length})
          </Link>

          {isAdmin && (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;