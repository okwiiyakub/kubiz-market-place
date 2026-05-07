import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import {
  BarChart3,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  UserPlus,
  X,
} from "lucide-react";

function Navbar({ onSearch }) {
  const { cartItems } = useCart();
  const { customer, logoutCustomer } = useAuth();
  const location = useLocation();

  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const isActive = (path) => location.pathname === path;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchText);
    }

    setMenuOpen(false);
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

  const linkClass = (path) =>
    `flex items-center gap-2 hover:text-blue-600 transition ${
      isActive(path) ? "text-blue-600 font-bold" : "text-gray-700"
    }`;

  const mobileLinkClass =
    "flex items-center gap-3 hover:text-blue-600 transition";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl sm:text-2xl font-extrabold text-blue-600 tracking-tight"
          >
            Kubiz Market Place
          </Link>

          <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 rounded-r-xl hover:bg-blue-700 transition font-semibold flex items-center gap-2"
            >
              <Search size={16} />
              Search
            </button>
          </form>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden border border-gray-300 rounded-xl px-4 py-2 font-bold text-gray-700"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden md:flex items-center gap-5 font-medium">
            <Link to="/" className={linkClass("/")}>
              <Home size={17} />
              Home
            </Link>

            {!isAdmin && (
              <>
                <a
                  href="/#products"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <Package size={17} />
                  Products
                </a>

                <a
                  href="/#categories"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <ClipboardList size={17} />
                  Categories
                </a>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>

                <Link to="/admin-products" className={linkClass("/admin-products")}>
                  <Package size={17} />
                  Products
                </Link>

                <Link to="/admin-orders" className={linkClass("/admin-orders")}>
                  <ClipboardList size={17} />
                  Orders
                </Link>

                <Link to="/admin-reports" className={linkClass("/admin-reports")}>
                  <BarChart3 size={17} />
                  Reports
                </Link>
              </>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <ShoppingCart size={18} />
              Cart

              {cartCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isAdmin && customer && (
              <>
                <Link to="/my-orders" className={linkClass("/my-orders")}>
                  <ClipboardList size={17} />
                  My Orders
                </Link>

                <Link to="/account" className={linkClass("/account")}>
                  <User size={17} />
                  Account
                </Link>

                <button
                  onClick={handleCustomerLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            )}

            {!isAdmin && !customer && (
              <>
                <Link to="/login" className={linkClass("/login")}>
                  <LogIn size={17} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <UserPlus size={17} />
                  Register
                </Link>
              </>
            )}

            {isAdmin && (
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={17} />
                Logout
              </button>
            )}
          </div>
        </div>

        {customer && !isAdmin && (
          <p className="hidden md:block text-sm text-gray-500 mt-2">
            Welcome, <span className="font-semibold">{customer.full_name}</span>
          </p>
        )}

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
                className="bg-blue-600 text-white px-5 rounded-r-xl hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Search size={16} />
                Search
              </button>
            </form>

            {customer && !isAdmin && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="font-bold text-gray-900">{customer.full_name}</p>
              </div>
            )}

            <div className="flex flex-col gap-4 text-gray-700 font-medium">
              <Link to="/" onClick={closeMenu} className={mobileLinkClass}>
                <Home size={18} />
                Home
              </Link>

              {!isAdmin && (
                <>
                  <a
                    href="/#products"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    <Package size={18} />
                    Products
                  </a>

                  <a
                    href="/#categories"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    <ClipboardList size={18} />
                    Categories
                  </a>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/dashboard" onClick={closeMenu} className={mobileLinkClass}>
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    to="/admin-products"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    <Package size={18} />
                    Admin Products
                  </Link>

                  <Link
                    to="/admin-orders"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    <ClipboardList size={18} />
                    Admin Orders
                  </Link>

                  <Link
                    to="/admin-reports"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    <BarChart3 size={18} />
                    Reports
                  </Link>
                </>
              )}

              <Link to="/cart" onClick={closeMenu} className={mobileLinkClass}>
                <ShoppingCart size={18} />
                Cart ({cartCount})
              </Link>

              {!isAdmin && customer && (
                <>
                  <Link to="/my-orders" onClick={closeMenu} className={mobileLinkClass}>
                    <ClipboardList size={18} />
                    My Orders
                  </Link>

                  <Link to="/account" onClick={closeMenu} className={mobileLinkClass}>
                    <User size={18} />
                    My Account
                  </Link>

                  <button
                    onClick={handleCustomerLogout}
                    className="flex items-center gap-3 text-left text-red-600"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}

              {!isAdmin && !customer && (
                <>
                  <Link to="/login" onClick={closeMenu} className={mobileLinkClass}>
                    <LogIn size={18} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-center flex items-center justify-center gap-2"
                  >
                    <UserPlus size={18} />
                    Register
                  </Link>
                </>
              )}

              {isAdmin && (
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-3 text-left text-red-600"
                >
                  <LogOut size={18} />
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