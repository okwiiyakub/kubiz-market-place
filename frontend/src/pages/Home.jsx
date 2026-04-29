import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";

function Home() {
  const [message, setMessage] = useState("Loading...");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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
      })
      .catch(() => {
        setError("Failed to load products.");
      });
  }, [searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  const featuredProducts = products
    .filter((product) => product.is_featured)
    .slice(0, 3);

  const latestProducts = products.slice(0, 6);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar onSearch={setSearchTerm} />
      <Hero />

      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-10">
          <p className="text-gray-500 text-lg">{message}</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {/* TRUST STRIP */}
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

        {/* FEATURED PRODUCTS */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* CATEGORIES */}
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

        {/* LATEST PRODUCTS */}
        {!searchTerm && !selectedCategory && latestProducts.length > 0 && (
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

        {/* ALL / FILTERED PRODUCTS */}
        <section id="products">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                Fresh listings
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                {searchTerm || selectedCategory
                  ? "Filtered Products"
                  : "All Products"}
              </h2>
            </div>

            {(searchTerm || selectedCategory) && (
              <div className="flex flex-wrap items-center gap-3">
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

                <button
                  onClick={clearFilters}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-200 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-600 shadow-sm border border-gray-100">
              No products found for your current filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default Home;