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
  } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Your cart is empty.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {item.name}
                    </h2>

                    <p className="text-gray-500 mb-2">
                      Category: {item.category_name}
                    </p>

                    <p className="text-green-600 font-extrabold text-xl mb-4">
                      UGX {Number(item.price).toLocaleString()}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-10 h-10 rounded-lg border border-gray-300 text-lg font-bold"
                      >
                        -
                      </button>

                      <span className="text-lg font-semibold px-4">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-10 h-10 rounded-lg border border-gray-300 text-lg font-bold"
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
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Cart Summary
              </h2>

              <div className="flex justify-between mb-4 text-lg">
                <span>Total</span>
                <span className="font-extrabold text-green-600">
                  UGX {cartTotal.toLocaleString()}
                </span>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mb-4">
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full border border-red-500 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
              >
                Clear Cart
              </button>
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