import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import MobileBottomNav from "../components/MobileBottomNav";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import getCsrfToken from "../utils/getCsrfToken";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = cartTotal > 0 ? 5000 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "cash_on_delivery",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const invalidStockItems = cartItems.filter(
    (item) => item.stock_quantity <= 0 || item.quantity > item.stock_quantity
  );

  const hasInvalidStock = invalidStockItems.length > 0;

  useEffect(() => {
    if (customer) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: customer.full_name || "",
        email: customer.email || "",
      }));
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (hasInvalidStock) {
      setError(
        "Some items in your cart are out of stock or exceed available stock. Please return to cart and adjust them."
      );
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      full_name: formData.fullName,
      phone_number: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      notes: `${formData.notes} Payment method: ${formData.paymentMethod}. Delivery fee: UGX ${deliveryFee}.`,
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      const response = await api.post("orders/", payload, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      localStorage.setItem("kubiz-last-order", JSON.stringify(response.data));
      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm flex items-center gap-2">
            <ShoppingBag size={16} />
            Secure Checkout
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Confirm your delivery details and place your order.
          </p>
        </div>

        {customer && (
          <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl px-6 py-4 mb-8 flex items-center gap-3">
            <CheckCircle size={20} />
            <p>
              You are checking out as <strong>{customer.full_name}</strong>.
              Your name and email have been filled automatically.
            </p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />

            <p className="text-gray-600 text-lg mb-4">
              Your cart is empty. Add products before checking out.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <ShoppingCart size={18} />
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form
              onSubmit={handlePlaceOrder}
              className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={24} />
                Customer Information
              </h2>

              {error && (
                <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </p>
              )}

              {hasInvalidStock && (
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-5 mb-6">
                  <p className="font-bold mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Stock issue detected
                  </p>

                  <p className="text-sm mb-3">
                    Some items are unavailable or exceed current stock. Please go
                    back to your cart and adjust them before placing the order.
                  </p>

                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-700 transition"
                  >
                    <ShoppingCart size={16} />
                    Return to Cart
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>

                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Address *
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter delivery address"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`border rounded-2xl p-4 cursor-pointer transition ${
                      formData.paymentMethod === "cash_on_delivery"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === "cash_on_delivery"}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      <Wallet size={22} className="text-blue-600" />
                      <div>
                        <p className="font-bold text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-500">
                          Pay when your order arrives.
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`border rounded-2xl p-4 cursor-pointer transition ${
                      formData.paymentMethod === "mobile_money"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile_money"
                      checked={formData.paymentMethod === "mobile_money"}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      <CreditCard size={22} className="text-green-600" />
                      <div>
                        <p className="font-bold text-gray-900">
                          Mobile Money
                        </p>
                        <p className="text-sm text-gray-500">
                          Payment instructions after order review.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any extra information about your order"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading || hasInvalidStock}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package size={24} />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const isOutOfStock = item.stock_quantity <= 0;
                  const exceedsStock = item.quantity > item.stock_quantity;

                  return (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 pb-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-xs text-gray-400">
                            Available: {item.stock_quantity}
                          </p>
                        </div>

                        <p className="font-bold text-green-600">
                          UGX{" "}
                          {(Number(item.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {isOutOfStock && (
                        <p className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs mt-3 flex items-center gap-2">
                          <AlertCircle size={14} />
                          This item is out of stock.
                        </p>
                      )}

                      {exceedsStock && !isOutOfStock && (
                        <p className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-xl text-xs mt-3 flex items-center gap-2">
                          <AlertCircle size={14} />
                          Quantity exceeds available stock.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 border-b border-gray-100 pb-5 mb-5">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-bold">
                    UGX {cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span className="flex items-center gap-2">
                    <Truck size={16} />
                    Delivery Fee
                  </span>
                  <span className="font-bold">
                    UGX {deliveryFee.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-green-600">
                  UGX {finalTotal.toLocaleString()}
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-sm text-gray-600">
                <p className="flex gap-2">
                  <Truck size={18} className="text-blue-600 shrink-0" />
                  Delivery fee is estimated and may be confirmed by support.
                </p>

                <p className="flex gap-2">
                  <MessageCircle size={18} className="text-green-600 shrink-0" />
                  You can contact WhatsApp support after placing your order.
                </p>

                <p className="flex gap-2">
                  <MapPin size={18} className="text-purple-600 shrink-0" />
                  Make sure your delivery address and city are correct.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <FloatingWhatsAppButton />
      <MobileBottomNav />
    </div>
  );
}

export default Checkout;