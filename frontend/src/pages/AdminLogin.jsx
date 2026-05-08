import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    if (username === "admin") {
      localStorage.setItem("isAdmin", "true");
      navigate("/dashboard");
      return;
    }

    setError("Invalid admin username.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm mb-2">
          Admin Access
        </p>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Admin Login
        </h2>

        <p className="text-gray-500 mb-6">
          Login to access the Kubiz Market Place dashboard.
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-5">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter admin username"
            value={username}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-xs text-gray-500 mt-2">
            Current test username is <strong>admin</strong>. Password can be any
            value for now.
          </p>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Login to Dashboard
        </button>

        <Link
          to="/"
          className="block text-center text-gray-500 hover:text-blue-600 mt-5"
        >
          Back to Store
        </Link>
      </form>
    </div>
  );
}

export default AdminLogin;