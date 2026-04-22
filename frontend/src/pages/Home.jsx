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

    api.get("products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {
        setError("Failed to load products.");
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Hero />

      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-10">
          <p className="text-gray-500 text-lg">{message}</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                Browse with ease
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Shop by Categories
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                Fresh listings
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Available Products
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default Home;