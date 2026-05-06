import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://127.0.0.1:8000${product.image}`
    : null;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const shortDescription =
    product.description && product.description.length > 85
      ? product.description.slice(0, 85) + "..."
      : product.description || "No description available.";

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product);
    setMessage("Added to cart");

    setTimeout(() => {
      setMessage("");
    }, 1800);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300">
      <div className="relative w-full h-60 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}

        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </span>
        )}

        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
            isOutOfStock
              ? "bg-red-100 text-red-700"
              : isLowStock
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm text-blue-600 font-semibold mb-2">
          {product.category_name || "Uncategorized"}
        </p>

        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 leading-6 min-h-[48px]">
          {shortDescription}
        </p>

        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-extrabold text-green-600">
            UGX {Number(product.price).toLocaleString()}
          </p>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isOutOfStock
                ? "bg-red-50 text-red-700"
                : isLowStock
                ? "bg-yellow-50 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            Stock: {product.stock_quantity}
          </span>
        </div>

        {message && (
          <p className="bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-xl mb-4">
            {message}
          </p>
        )}

        {isLowStock && !isOutOfStock && (
          <p className="bg-yellow-50 text-yellow-700 text-sm px-4 py-2 rounded-xl mb-4">
            Hurry, only {product.stock_quantity} left.
          </p>
        )}

        <div className="flex gap-3">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 border border-blue-600 text-blue-600 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;