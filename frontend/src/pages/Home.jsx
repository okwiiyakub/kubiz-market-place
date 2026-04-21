import { useEffect, useState } from "react";
import api from "../api/api";

function Home() {
  const [message, setMessage] = useState("Loading...");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load welcome message
    api.get("welcome/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch(() => {
        setError("Failed to load welcome message.");
      });

    // Load categories
    api.get("categories/")
      .then((response) => {
        setCategories(response.data);
      })
      .catch(() => {
        setError("Failed to load categories.");
      });

    // Load products
    api.get("products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {
        setError("Failed to load products.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-blue-600 mb-3">
          Kubiz Market Place Home Page
        </h1>

        {/* Welcome Message */}
        <p className="text-lg text-gray-700 mb-10">{message}</p>

        {error && (
          <p className="text-red-600 mb-6">{error}</p>
        )}

        {/* Categories Section */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Shop by Categories
          </h2>

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
        </section>

        {/* Products Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Available Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {products.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >

                {/* Product Image */}
                {product.image ? (
                  <img
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `http://127.0.0.1:8000${product.image}`
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}

                {/* Product Details */}
                <div className="p-6">

                  <h3 className="text-xl font-bold text-blue-600 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2">
                    Category: {product.category_name}
                  </p>

                  <p className="text-gray-600 mb-3">
                    {product.description || "No description available."}
                  </p>

                  <p className="text-lg font-semibold text-green-600 mb-2">
                    UGX {Number(product.price).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500">
                    Stock: {product.stock_quantity}
                  </p>

                </div>
              </div>

            ))}

          </div>
        </section>

      </div>
    </div>
  );
}

export default Home;