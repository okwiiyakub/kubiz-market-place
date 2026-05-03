import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
    cartCount,
    hasOutOfStockItem,
  } = useCart();

  const handleClearCart = () => {
    const confirmClear = window.confirm("Are you sure you want to clear your cart?");
    if (!confirmClear) return;

    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
              Shopping Cart
            </p>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Your Cart
            </h1>
            <p className="text-gray-500 mt-2">
              Review your selected products before checkout.
            </p>
          </div>

          <Link
            to="/"
            className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Your cart is empty.
            </p>

            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => {
                const isOutOfStock = item.stock_quantity <= 0;
                const isLowStock =
                  item.stock_quantity > 0 && item.stock_quantity <= 5;
                const reachedStockLimit = item.quantity >= item.stock_quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row gap-5"
                  >
                    <div className="w-full md:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden">
                      {item.image ? (
                        <img
                          src={
                            item.image.startsWith("http")
                              ? item.image
                              : `http://127.0.0.1:8000${item.image}`
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-2">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            {item.name}
                          </h2>

                          <p className="text-gray-500 mt-1">
                            Category: {item.category_name}
                          </p>
                        </div>

                        {isOutOfStock ? (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold w-fit">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold w-fit">
                            Low Stock
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold w-fit">
                            In Stock
                          </span>
                        )}
                      </div>

                      <p className="text-green-600 font-extrabold text-xl mb-4">
                        UGX {Number(item.price).toLocaleString()}
                      </p>

                      <p className="text-sm text-gray-500 mb-4">
                        Available stock: {item.stock_quantity}
                      </p>

                      {reachedStockLimit && !isOutOfStock && (
                        <p className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-sm mb-4">
                          You have reached the available stock limit for this item.
                        </p>
                      )}

                      {isOutOfStock && (
                        <p className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm mb-4">
                          This item is currently out of stock. Please remove it before checkout.
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 rounded-lg border border-gray-300 text-lg font-bold disabled:opacity-50"
                        >
                          -
                        </button>

                        <span className="text-lg font-semibold px-4">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          disabled={reachedStockLimit || isOutOfStock}
                          className="w-10 h-10 rounded-lg border border-gray-300 text-lg font-bold disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Cart Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Total Items</span>
                  <span className="font-bold">{cartCount}</span>
                </div>

                <div className="flex justify-between text-lg">
                  <span>Total Amount</span>
                  <span className="font-extrabold text-green-600">
                    UGX {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {hasOutOfStockItem && (
                <p className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  Your cart contains an out-of-stock item. Remove it before proceeding.
                </p>
              )}

              <Link
                to={hasOutOfStockItem ? "#" : "/checkout"}
                onClick={(e) => {
                  if (hasOutOfStockItem) {
                    e.preventDefault();
                  }
                }}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition mb-4 ${
                  hasOutOfStockItem
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={handleClearCart}
                className="w-full border border-red-500 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition mb-4"
              >
                Clear Cart
              </button>

              <Link
                to="/"
                className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default Cart;