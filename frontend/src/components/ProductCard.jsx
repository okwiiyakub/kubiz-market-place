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

  const isLowStock =
    product.stock_quantity > 0 && product.stock_quantity <= 5;

  const shortDescription =
    product.description && product.description.length > 55
      ? product.description.slice(0, 55) + "..."
      : product.description || "No description available.";

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product);

    setMessage("Added");

    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition duration-300">
      <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}

        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold">
            Featured
          </span>
        )}

        <span
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold ${
            isOutOfStock
              ? "bg-red-100 text-red-700"
              : isLowStock
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isOutOfStock
            ? "Out"
            : isLowStock
            ? "Low"
            : "In Stock"}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
          {product.category_name || "General"}
        </p>

        <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2 min-h-[44px]">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm leading-5 mb-3 min-h-[40px]">
          {shortDescription}
        </p>

        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-extrabold text-green-600">
            UGX {Number(product.price).toLocaleString()}
          </p>

          <span className="text-[11px] text-gray-500 font-medium">
            {product.stock_quantity} left
          </span>
        </div>

        {message && (
          <p className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg mb-3 text-center">
            {message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            View
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;