import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import api from "../api/api";
import { Link } from "react-router-dom";
import getCsrfToken from "../utils/getCsrfToken";


function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const fetchProducts = () => {
    api.get("products/admin/manage/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {
        setError("Failed to load admin products.");
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      await api.delete(`products/admin/manage/${id}/`, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
            <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
            Admin Management
            </p>
            <h1 className="text-4xl font-extrabold text-gray-900">
            Product Manager
            </h1>
        </div>

        <Link
            to="/admin-products/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
            Add Product
        </Link>
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </p>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Active</th>
                <th className="py-3 pr-4">Featured</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-4 pr-4">{product.id}</td>
                  <td className="py-4 pr-4">{product.name}</td>
                  <td className="py-4 pr-4">{product.category_name}</td>
                  <td className="py-4 pr-4 text-green-600 font-semibold">
                    UGX {Number(product.price).toLocaleString()}
                  </td>
                  <td className="py-4 pr-4">{product.stock_quantity}</td>
                  <td className="py-4 pr-4">
                    {product.is_active ? "Yes" : "No"}
                  </td>
                  <td className="py-4 pr-4">
                    {product.is_featured ? "Yes" : "No"}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin-products/edit/${product.id}`}
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <p className="text-gray-600 py-6">No products available.</p>
          )}
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default AdminProducts;