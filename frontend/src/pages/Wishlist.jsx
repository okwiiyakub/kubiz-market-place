import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("kubiz-wishlist")) || [];

    setWishlistItems(savedWishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => item.id !== productId
    );

    localStorage.setItem("kubiz-wishlist", JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const clearWishlist = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your wishlist?"
    );

    if (!confirmClear) return;

    localStorage.removeItem("kubiz-wishlist");
    setWishlistItems([]);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm flex items-center gap-2">
              <Heart size={16} />
              Saved Products
            </p>

            <h1 className="text-4xl font-extrabold text-gray-900">
              My Wishlist
            </h1>

            <p className="text-gray-500 mt-2">
              Products you have saved for later.
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="bg-red-100 text-red-600 px-5 py-3 rounded-xl font-semibold hover:bg-red-200 transition inline-flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your wishlist is empty
            </h2>

            <p className="text-gray-600 mb-6">
              Save products you like and come back to them later.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <ShoppingCart size={18} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-gray-600">
                You have{" "}
                <span className="font-bold text-gray-900">
                  {wishlistItems.length}
                </span>{" "}
                saved product(s).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 left-2 bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-700 transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default Wishlist;