import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`products/${slug}/`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-lg text-gray-600">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-red-600 text-lg mb-4">
            {error || "Product not found."}
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://127.0.0.1:8000${product.image}`
    : null;

  const whatsappNumber = "256783372406"; 

  const whatsappMessage = `Hello, I am interested in ${product.name} on Kubiz Market Place. Please share more details. Price seen: UGX ${Number(product.price).toLocaleString()}.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link
            to="/"
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
          <div className="bg-gray-100 rounded-2xl overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-[420px] object-cover"
              />
            ) : (
              <div className="w-full h-[420px] flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold mb-3">
              {product.category_name}
            </p>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-extrabold text-green-600 mb-6">
              UGX {Number(product.price).toLocaleString()}
            </p>

            <p className="text-gray-700 leading-8 mb-6">
              {product.description || "No description available for this product."}
            </p>

            <div className="mb-8">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                Stock Available: {product.stock_quantity}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Add to Cart
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-600 text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
        <FloatingWhatsAppButton />
    </div>
  );
}

export default ProductDetail;