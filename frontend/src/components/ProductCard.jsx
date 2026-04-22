import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://127.0.0.1:8000${product.image}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300">
      <div className="w-full h-60 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-500 mb-2">
          {product.category_name}
        </p>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          {product.description || "No description available."}
        </p>

        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-extrabold text-green-600">
            UGX {Number(product.price).toLocaleString()}
          </p>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            Stock: {product.stock_quantity}
          </span>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </Link>

          <button
            onClick={() => addToCart(product)}
            className="flex-1 border border-blue-600 text-blue-600 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;