import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PopularBrands from "../components/PopularBrands";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";

function Home() {
  const PRODUCTS_PER_PAGE = 6;

  const [message, setMessage] = useState("Loading...");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("welcome/")
      .then((response) => setMessage(response.data.message))
      .catch(() => setError("Failed to load welcome message."));

    api.get("categories/")
      .then((response) => setCategories(response.data))
      .catch(() => setError("Failed to load categories."));

    const savedViewed =
      JSON.parse(localStorage.getItem("kubiz-recently-viewed")) || [];
    setRecentlyViewed(savedViewed);
  }, []);

  useEffect(() => {
    let endpoint = "products/";
    const params = [];

    if (searchTerm) {
      params.push(`search=${encodeURIComponent(searchTerm)}`);
    }

    if (selectedCategory) {
      params.push(`category=${encodeURIComponent(selectedCategory)}`);
    }

    if (params.length > 0) {
      endpoint += `?${params.join("&")}`;
    }

    api.get(endpoint)
      .then((response) => {
        setProducts(response.data);
        setCurrentPage(1);
      })
      .catch(() => setError("Failed to load products."));
  }, [searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("newest");
    setCurrentPage(1);
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem("kubiz-recently-viewed");
    setRecentlyViewed([]);
  };

  const isFiltering = searchTerm || selectedCategory;

  const sortedProducts = useMemo(() => {
    const productCopy = [...products];

    if (sortOption === "price-low") {
      return productCopy.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortOption === "price-high") {
      return productCopy.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortOption === "name-az") {
      return productCopy.sort((a, b) => a.name.localeCompare(b.name));
    }

    return productCopy.sort((a, b) => b.id - a.id);
  }, [products, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const featuredProducts = products
    .filter((product) => product.is_featured)
    .slice(0, 3);

  const latestProducts = products.slice(0, 6);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar onSearch={setSearchTerm} />
      <Hero />
      <PopularBrands />

      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-10">
          <p className="text-gray-500 text-lg">{message}</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {!isFiltering && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Secure Shopping
                </h3>
                <p className="text-gray-600">
                  Place orders safely and track them from your customer account.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Quality Products
                </h3>
                <p className="text-gray-600">
                  Discover computers, phones, accessories, services, and digital products.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Quick Support
                </h3>
                <p className="text-gray-600">
                  Contact Kubiz Market Place directly through WhatsApp for help.
                </p>
              </div>
            </section>

            {featuredProducts.length > 0 && (
              <section className="mb-16">
                <div className="mb-8">
                  <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                    Recommended for you
                  </p>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Featured Products
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            <section id="categories" className="mb-16">
              <div className="mb-8">
                <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                  Browse with ease
                </p>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Shop by Categories
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onSelectCategory={setSelectedCategory}
                  />
                ))}
              </div>
            </section>

            {recentlyViewed.length > 0 && (
              <section className="mb-16">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div>
                    <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                      Continue browsing
                    </p>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                      Recently Viewed Products
                    </h2>
                  </div>

                  <button
                    onClick={clearRecentlyViewed}
                    className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Clear Recently Viewed
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {recentlyViewed.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {latestProducts.length > 0 && (
              <section className="mb-16">
                <div className="mb-8">
                  <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                    New arrivals
                  </p>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Latest Products
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section id="products">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                  {isFiltering ? "Search results" : "Fresh listings"}
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900">
                  {isFiltering ? "Filtered Products" : "All Products"}
                </h2>

                <p className="text-gray-500 mt-2">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {sortedProducts.length}
                  </span>{" "}
                  product(s)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                </select>

                {(searchTerm || selectedCategory || sortOption !== "newest") && (
                  <button
                    onClick={clearFilters}
                    className="bg-red-100 text-red-600 px-5 py-3 rounded-xl font-semibold hover:bg-red-200 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {(searchTerm || selectedCategory) && (
              <div className="flex flex-wrap gap-3 mt-5">
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    Search: {searchTerm}
                  </span>
                )}

                {selectedCategory && (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                    Category: {selectedCategory}
                  </span>
                )}
              </div>
            )}
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No products found
              </h3>

              <p className="text-gray-600 mb-6">
                Try using a different search term, category, or sorting option.
              </p>

              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                View All Products
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                  <p className="text-gray-600">
                    Page{" "}
                    <span className="font-bold text-gray-900">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-gray-900">
                      {totalPages}
                    </span>
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
            </>
          )}
        </section>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default Home;