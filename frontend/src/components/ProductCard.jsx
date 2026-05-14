import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Eye,
  ShoppingCart,
  CheckCircle,
  Package,
  Star,
  Heart,
} from "lucide-react";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("kubiz-wishlist")) || [];

    return savedWishlist.some((item) => item.id === product.id);
  });

  useEffect(() => {
    const savedReviews =
      JSON.parse(localStorage.getItem("kubiz-product-reviews")) || {};

    const productReviews = savedReviews[product.id] || [];

    if (productReviews.length > 0) {
      const total = productReviews.reduce(
        (sum, review) => sum + Number(review.rating),
        0
      );

      setAverageRating((total / productReviews.length).toFixed(1));
      setReviewCount(productReviews.length);
    } else {
      setAverageRating(0);
      setReviewCount(0);
    }
  }, [product.id]);

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://127.0.0.1:8000${product.image}`
    : null;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const shortDescription =
    product.description && product.description.length > 50
      ? product.description.slice(0, 50) + "..."
      : product.description || "No description available.";

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product);
    setMessage("Added to cart");

    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  const toggleWishlist = () => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("kubiz-wishlist")) || [];

    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = savedWishlist.filter((item) => item.id !== product.id);
      setIsWishlisted(false);
      setMessage("Removed from wishlist");
    } else {
      updatedWishlist = [
        product,
        ...savedWishlist.filter((item) => item.id !== product.id),
      ];
      setIsWishlisted(true);
      setMessage("Saved to wishlist");
    }

    localStorage.setItem("kubiz-wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));

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
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-sm">
            <Package size={28} className="mb-2" />
            No Image
          </div>
        )}

        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Star size={11} />
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
          {isOutOfStock ? "Out" : isLowStock ? "Low Stock" : "In Stock"}
        </span>

        <button
          onClick={toggleWishlist}
          className={`absolute bottom-2 right-2 p-2 rounded-full shadow transition ${
            isWishlisted
              ? "bg-red-600 text-white"
              : "bg-white text-gray-600 hover:text-red-600"
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
          {product.category_name || "General"}
        </p>

        <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2 min-h-[44px]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
              className={
                star <= Math.round(averageRating)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
              fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
            />
          ))}

          <span className="text-xs text-gray-500 ml-1">
            {reviewCount > 0
              ? `${averageRating} (${reviewCount})`
              : "No reviews"}
          </span>
        </div>

        <p className="text-gray-500 text-sm leading-5 mb-3 min-h-[40px]">
          {shortDescription}
        </p>

        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-lg font-extrabold text-green-600">
            UGX {Number(product.price).toLocaleString()}
          </p>

          <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
            <Package size={13} />
            {product.stock_quantity} left
          </span>
        </div>

        {isLowStock && !isOutOfStock && (
          <p className="bg-yellow-50 text-yellow-700 text-xs px-3 py-2 rounded-lg mb-3">
            Hurry, few items left.
          </p>
        )}

        {message && (
          <p className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg mb-3 text-center flex items-center justify-center gap-2">
            <CheckCircle size={14} />
            {message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Eye size={15} />
            View
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={15} />
            {isOutOfStock ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;