import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin") {
      localStorage.setItem("isAdmin", "true");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded-xl px-4 py-3 mb-4"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl px-4 py-3 mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;