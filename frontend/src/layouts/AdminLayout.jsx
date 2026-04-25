import { Link, useLocation } from "react-router-dom";

function AdminLayout({ children }) {
  const location = useLocation();

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Products", path: "/admin-products" },
    { label: "Orders", path: "/admin-orders" },
    { label: "Reports", path: "/admin-reports" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-72 bg-gray-900 text-white min-h-screen p-6 hidden lg:block">
        <Link to="/" className="block mb-10">
          <h1 className="text-2xl font-extrabold text-blue-400">
            Kubiz Admin
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Marketplace Control Panel
          </p>
        </Link>

        <nav className="space-y-2">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Manage products, orders, reports, and analytics
            </p>
          </div>

          <Link
            to="/"
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-200 transition"
          >
            View Store
          </Link>
        </header>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;