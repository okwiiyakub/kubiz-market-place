import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
          .slice(0, 3);

        setRelatedProducts(related);
      })
      .catch(() => {
        setRelatedProducts([]);
      });
  }, [product]);

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
          <p className="text-lg text-gray-600">Loading product details...</p>
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
          <p className="text-red-600 text-lg mb-4">
            {error || "Product not found."}
          </p>

          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
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

  const whatsappMessage = `Hello, I am interested in ${product.name} on Kubiz Market Place. Price: UGX ${Number(product.price).toLocaleString()}. Please share more details.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>{" "}
          / <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 lg:p-10">
          <div>
            <div className="bg-gray-100 rounded-3xl overflow-hidden border border-gray-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-[460px] object-cover"
                />
              ) : (
                <div className="w-full h-[460px] flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="h-24 rounded-2xl bg-gray-100 border border-blue-500 overflow-hidden">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {product.category_name}
              </span>

              {product.is_featured && (
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isOutOfStock
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-4xl font-extrabold text-green-600 mb-6">
              UGX {Number(product.price).toLocaleString()}
            </p>

            <p className="text-gray-700 leading-8 mb-8 text-lg">
              {product.description || "No description available for this product."}
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6">
              <p className="text-sm text-gray-500 mb-2">Available Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {product.stock_quantity} item(s)
              </p>
            </div>

            {!isOutOfStock && (
              <div className="mb-6">
                <p className="font-semibold text-gray-800 mb-3">
                  Select Quantity
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    className="w-12 h-12 rounded-xl border border-gray-300 text-xl font-bold hover:bg-gray-100"
                  >
                    -
                  </button>

                  <span className="text-2xl font-bold min-w-10 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    className="w-12 h-12 rounded-xl border border-gray-300 text-xl font-bold hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {addedMessage && (
              <p className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-5">
                {addedMessage}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center border border-green-600 text-green-600 px-6 py-4 rounded-xl font-bold hover:bg-green-50 transition"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="font-bold text-gray-900">Trusted Seller</p>
                <p className="text-sm text-gray-500 mt-1">
                  Verified marketplace listing
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="font-bold text-gray-900">Fast Inquiry</p>
                <p className="text-sm text-gray-500 mt-1">
                  Contact seller instantly
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="font-bold text-gray-900">Order Tracking</p>
                <p className="text-sm text-gray-500 mt-1">
                  Track after checkout
                </p>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="mb-8">
              <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                Similar products
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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