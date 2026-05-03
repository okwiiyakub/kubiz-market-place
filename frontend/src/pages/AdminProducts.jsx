import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import getCsrfToken from "../utils/getCsrfToken";
import AdminLayout from "../layouts/AdminLayout";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    active: "all",
    featured: "all",
  });

  const fetchProducts = () => {
    api.get("products/admin/manage/")
      .then((response) => setProducts(response.data))
      .catch(() => setError("Failed to load admin products."));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      await api.delete(`products/admin/manage/${id}/`, {
        headers: { "X-CSRFToken": csrfToken },
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const categories = [
    ...new Set(products.map((product) => product.category_name).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesCategory =
      filters.category === "all" || product.category_name === filters.category;

    const matchesActive =
      filters.active === "all" ||
      String(product.is_active) === filters.active;

    const matchesFeatured =
      filters.featured === "all" ||
      String(product.is_featured) === filters.featured;

    return matchesSearch && matchesCategory && matchesActive && matchesFeatured;
  });

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      active: "all",
      featured: "all",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
              Admin Management
            </p>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Product Manager
            </h1>
            <p className="text-gray-500 mt-2">
              Search, filter, add, edit, and manage marketplace products.
            </p>
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

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Product Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search by product name..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="md:col-span-2 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.active}
              onChange={(e) =>
                setFilters({ ...filters, active: e.target.value })
              }
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <select
              value={filters.featured}
              onChange={(e) =>
                setFilters({ ...filters, featured: e.target.value })
              }
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Featured</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5">
            <p className="text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {products.length}
              </span>{" "}
              products
            </p>

            <button
              onClick={clearFilters}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </section>

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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-4 pr-4">{product.id}</td>
                  <td className="py-4 pr-4 font-semibold text-gray-900">
                    {product.name}
                  </td>
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

          {filteredProducts.length === 0 && (
            <p className="text-gray-600 py-6">
              No products match the selected filters.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;