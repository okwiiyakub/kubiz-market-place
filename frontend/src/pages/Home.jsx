import { useEffect, useState } from "react";
import api from "../api/api";

function Home() {
  const [message, setMessage] = useState("Loading...");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("welcome/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch(() => {
        setError("Failed to load welcome message.");
      });

    api.get("categories/")
      .then((response) => {
        setCategories(response.data);
      })
      .catch(() => {
        setError("Failed to load categories.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-3">
          Kubiz Market Place Home Page
        </h1>
        <p className="text-lg text-gray-700 mb-10">{message}</p>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Shop by Categories
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-blue-600 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600">
                {category.description || "No description available."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;