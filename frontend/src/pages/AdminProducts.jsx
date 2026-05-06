import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import getCsrfToken from "../utils/getCsrfToken";
import AdminLayout from "../layouts/AdminLayout";

function AdminProducts() {
  const PRODUCTS_PER_PAGE = 8;

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    active: "all",
    featured: "all",
    stock: "all",
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

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

  const lowStockProducts = products.filter(
    (product) => product.stock_quantity > 0 && product.stock_quantity <= 5
  );

  const outOfStockProducts = products.filter(
    (product) => product.stock_quantity <= 0
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesCategory =
      filters.category === "all" || product.category_name === filters.category;

    const matchesActive =
      filters.active === "all" || String(product.is_active) === filters.active;

    const matchesFeatured =
      filters.featured === "all" ||
      String(product.is_featured) === filters.featured;

    const matchesStock =
      filters.stock === "all" ||
      (filters.stock === "low" &&
        product.stock_quantity > 0 &&
        product.stock_quantity <= 5) ||
      (filters.stock === "out" && product.stock_quantity <= 0) ||
      (filters.stock === "available" && product.stock_quantity > 5);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesActive &&
      matchesFeatured &&
      matchesStock
    );
  });

  const sortedProducts = useMemo(() => {
    const productCopy = [...filteredProducts];

    if (sortOption === "price-low") {
      return productCopy.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortOption === "price-high") {
      return productCopy.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortOption === "stock-low") {
      return productCopy.sort(
        (a, b) => Number(a.stock_quantity) - Number(b.stock_quantity)
      );
    }

    if (sortOption === "stock-high") {
      return productCopy.sort(
        (a, b) => Number(b.stock_quantity) - Number(a.stock_quantity)
      );
    }

    if (sortOption === "name-az") {
      return productCopy.sort((a, b) => a.name.localeCompare(b.name));
    }

    return productCopy.sort((a, b) => b.id - a.id);
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      active: "all",
      featured: "all",
      stock: "all",
    });
    setSortOption("newest");
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const getStockBadge = (quantity) => {
    if (quantity <= 0) {
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
          Out of Stock
        </span>
      );
    }

    if (quantity <= 5) {
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
          Low Stock
        </span>
      );
    }

    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
        Available
      </span>
    );
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
              Search, filter, sort, add, edit, and manage marketplace products.
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-2">Total Products</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {products.length}
            </h2>
          </div>

          <div className="bg-yellow-50 rounded-2xl border border-yellow-100 shadow-sm p-6">
            <p className="text-yellow-700 text-sm mb-2">Low Stock Products</p>
            <h2 className="text-3xl font-extrabold text-yellow-700">
              {lowStockProducts.length}
            </h2>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6">
            <p className="text-red-700 text-sm mb-2">Out of Stock Products</p>
            <h2 className="text-3xl font-extrabold text-red-700">
              {outOfStockProducts.length}
            </h2>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Product Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search by product name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="md:col-span-2 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
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
              onChange={(e) => handleFilterChange("active", e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange("featured", e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Featured</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>

            <select
              value={filters.stock}
              onChange={(e) => handleFilterChange("stock", e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Stock</option>
              <option value="available">Available</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-low">Sort: Price Low to High</option>
              <option value="price-high">Sort: Price High to Low</option>
              <option value="stock-low">Sort: Stock Low to High</option>
              <option value="stock-high">Sort: Stock High to Low</option>
              <option value="name-az">Sort: Name A to Z</option>
            </select>

            <div className="md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {sortedProducts.length}
                </span>{" "}
                product(s)
              </p>

              <button
                onClick={clearFilters}
                className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Clear Filters
              </button>
            </div>
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
                <th className="py-3 pr-4">Stock Status</th>
                <th className="py-3 pr-4">Active</th>
                <th className="py-3 pr-4">Featured</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-4 pr-4">{product.id}</td>

                  <td className="py-4 pr-4 font-semibold text-gray-900">
                    {product.name}
                  </td>

                  <td className="py-4 pr-4">{product.category_name}</td>

                  <td className="py-4 pr-4 text-green-600 font-semibold">
                    UGX {Number(product.price).toLocaleString()}
                  </td>

                  <td className="py-4 pr-4 font-semibold">
                    {product.stock_quantity}
                  </td>

                  <td className="py-4 pr-4">
                    {getStockBadge(product.stock_quantity)}
                  </td>

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

          {sortedProducts.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-5">
                No products match your current filters.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                View All Products
              </button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-gray-600">
              Page{" "}
              <span className="font-bold text-gray-900">{currentPage}</span>{" "}
              of <span className="font-bold text-gray-900">{totalPages}</span>
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;