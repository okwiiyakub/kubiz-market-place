import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  BarChart3,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";

function AdminLayout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/admin-products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/admin-orders",
      icon: ShoppingBag,
    },
    {
      label: "Reports",
      path: "/admin-reports",
      icon: BarChart3,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-72 bg-gray-900 text-white min-h-screen p-6 hidden lg:flex lg:flex-col">
        <Link to="/" className="block mb-10">
          <h1 className="text-2xl font-extrabold text-blue-400">
            Kubiz Admin
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Marketplace Control Panel
          </p>
        </Link>

        <nav className="space-y-2 flex-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 pt-6 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-gray-800 text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-700 transition"
          >
            <Store size={18} />
            View Store
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="text-sm text-gray-500 hidden sm:block">
              Manage products, orders, reports, and analytics
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/"
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-200 transition flex items-center gap-2"
            >
              <Home size={17} />
              View Store
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden border border-gray-300 text-gray-700 rounded-xl px-4 py-2 font-semibold flex items-center gap-2"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            {menuOpen ? "Close" : "Menu"}
          </button>
        </header>

        {menuOpen && (
          <div className="lg:hidden bg-gray-900 text-white p-5">
            <nav className="space-y-2 mb-5">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Icon size={19} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 bg-gray-800 text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-700 transition"
              >
                <Store size={18} />
                View Store
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;