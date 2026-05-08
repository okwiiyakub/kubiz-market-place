import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Headphones,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    api.get(`products/${slug}/`)
      .then((response) => {
        const viewedProduct = response.data;

        setProduct(viewedProduct);
        setLoading(false);
        setQuantity(1);

        const savedViewed =
          JSON.parse(localStorage.getItem("kubiz-recently-viewed")) || [];

        const updatedViewed = [
          viewedProduct,
          ...savedViewed.filter((item) => item.id !== viewedProduct.id),
        ].slice(0, 4);

        localStorage.setItem(
          "kubiz-recently-viewed",
          JSON.stringify(updatedViewed)
        );
      })
      .catch(() => {
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    api.get("products/")
      .then((response) => {
        const related = response.data
          .filter(
            (item) =>
              item.category_name === product.category_name &&
              item.slug !== product.slug
          )
          .slice(0, 4);

        setRelatedProducts(related);
      })
      .catch(() => {
        setRelatedProducts([]);
      });
  }, [product]);

  const isOutOfStock = product && product.stock_quantity <= 0;

  const isLowStock =
    product && product.stock_quantity > 0 && product.stock_quantity <= 5;

  const reachedStockLimit = product && quantity >= product.stock_quantity;

  const increaseQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) {
      setAddedMessage("This product is currently out of stock.");
      setTimeout(() => setAddedMessage(""), 2500);
      return;
    }

    if (quantity > product.stock_quantity) {
      setAddedMessage("Selected quantity exceeds available stock.");
      setTimeout(() => setAddedMessage(""), 2500);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAddedMessage(`${quantity} item(s) added to cart.`);
    setTimeout(() => setAddedMessage(""), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center gap-3 text-gray-600">
            <Package size={22} />
            Loading product details...
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-white border border-gray-100 rounded-2xl p-8">
            <p className="text-red-600 text-lg mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              {error || "Product not found."}
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <ChevronLeft size={18} />
              Back to Home
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://localhost:8000${product.image}`
    : null;

  const whatsappNumber = "2567XXXXXXXX";

  const whatsappMessage = `Hello, I am interested in ${product.name} on Kubiz Market Place. Price: UGX ${Number(
    product.price
  ).toLocaleString()}. Please share more details.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-5 text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 p-5 lg:p-7">
          <div>
            <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-[320px] lg:h-[420px] object-cover"
                />
              ) : (
                <div className="w-full h-[320px] lg:h-[420px] flex flex-col items-center justify-center text-gray-500">
                  <Package size={40} className="mb-2" />
                  No Image Available
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                <Tag size={13} />
                {product.category_name}
              </span>

              {product.is_featured && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={13} />
                  Featured
                </span>
              )}

              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                  isOutOfStock
                    ? "bg-red-100 text-red-700"
                    : isLowStock
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <Package size={13} />
                {isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                  ? "Low Stock"
                  : "In Stock"}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            <p className="text-3xl font-extrabold text-green-600 mb-5">
              UGX {Number(product.price).toLocaleString()}
            </p>

            <p className="text-gray-700 leading-7 mb-6">
              {product.description ||
                "No description available for this product."}
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <Package size={16} />
                    Available Stock
                  </p>

                  <p className="text-xl font-bold text-gray-900">
                    {product.stock_quantity} item(s)
                  </p>
                </div>

                {!isOutOfStock && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 text-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="text-xl font-bold min-w-8 text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      disabled={reachedStockLimit}
                      className="w-10 h-10 rounded-lg border border-gray-300 text-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                )}
              </div>

              {isLowStock && (
                <p className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-sm mt-4 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Hurry, only {product.stock_quantity} item(s) left.
                </p>
              )}

              {isOutOfStock && (
                <p className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm mt-4 flex items-center gap-2">
                  <AlertCircle size={16} />
                  This product is currently unavailable.
                </p>
              )}

              {reachedStockLimit && !isOutOfStock && (
                <p className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-sm mt-4 flex items-center gap-2">
                  <AlertCircle size={16} />
                  You have reached the available stock limit.
                </p>
              )}
            </div>

            {addedMessage && (
              <p
                className={`px-4 py-3 rounded-xl mb-5 text-sm font-semibold flex items-center gap-2 ${
                  addedMessage.includes("added")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {addedMessage.includes("added") ? (
                  <CheckCircle size={17} />
                ) : (
                  <AlertCircle size={17} />
                )}
                {addedMessage}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || quantity > product.stock_quantity}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart size={19} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center border border-green-600 text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                <MessageCircle size={19} />
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 text-center flex flex-col items-center">
                <ShieldCheck size={22} className="text-blue-600 mb-2" />

                <p className="font-bold text-gray-900">Secure</p>

                <p className="text-xs text-gray-500">Safe ordering</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center flex flex-col items-center">
                <Headphones size={22} className="text-green-600 mb-2" />

                <p className="font-bold text-gray-900">Support</p>

                <p className="text-xs text-gray-500">WhatsApp help</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center flex flex-col items-center">
                <Truck size={22} className="text-orange-600 mb-2" />

                <p className="font-bold text-gray-900">Tracking</p>

                <p className="text-xs text-gray-500">Order updates</p>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="mb-6">
              <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                You may also like
              </p>

              <h2 className="text-3xl font-extrabold text-gray-900">
                Related Products
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default ProductDetail;