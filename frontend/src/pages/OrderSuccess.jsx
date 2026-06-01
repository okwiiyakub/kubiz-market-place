import { Link } from "react-router-dom";
import {
  CheckCircle,
  ClipboardList,
  Home,
  Mail,
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
import { useAuth } from "../context/AuthContext";

function OrderSuccess() {
  const { customer } = useAuth();
  const lastOrder = JSON.parse(localStorage.getItem("kubiz-last-order"));

  const whatsappNumber = "2567XXXXXXXX";

  const whatsappMessage = lastOrder
    ? `Hello, I have placed Order #${lastOrder.id} on Kubiz Market Place. I would like support with my order.`
    : "Hello, I have placed an order on Kubiz Market Place. I would like support.";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={42} />
          </div>

          <p className="text-green-600 font-semibold uppercase tracking-wide text-sm mb-3 flex items-center justify-center gap-2">
            <ShoppingBag size={16} />
            Order Confirmation
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Order Placed Successfully
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for shopping with Kubiz Market Place. Your order has been
            received and will be reviewed for confirmation.
          </p>

          {lastOrder ? (
            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 text-left mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ClipboardList size={24} />
                    Order #{lastOrder.id}
                  </h2>

                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <User size={16} />
                    Customer: {lastOrder.full_name}
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold capitalize w-fit">
                  {lastOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone size={18} />
                    Contact Details
                  </h3>

                  <p className="text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={15} />
                    <span className="font-semibold">Phone:</span>{" "}
                    {lastOrder.phone_number}
                  </p>

                  <p className="text-gray-700 flex items-center gap-2">
                    <Mail size={15} />
                    <span className="font-semibold">Email:</span>{" "}
                    {lastOrder.email || "Not provided"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck size={18} />
                    Delivery Details
                  </h3>

                  <p className="text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={15} />
                    <span className="font-semibold">Address:</span>{" "}
                    {lastOrder.address}
                  </p>

                  <p className="text-gray-700 flex items-center gap-2">
                    <MapPin size={15} />
                    <span className="font-semibold">City:</span>{" "}
                    {lastOrder.city}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={18} />
                  Ordered Items
                </h3>

                <ul className="space-y-3">
                  {lastOrder.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between gap-2 text-gray-700 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <span className="flex items-center gap-2">
                        <Package size={15} />
                        {item.product_name} × {item.quantity}
                      </span>

                      {item.subtotal && (
                        <span className="font-semibold text-green-600">
                          UGX {Number(item.subtotal).toLocaleString()}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Wallet size={22} />
                  Total Amount
                </span>

                <span className="text-3xl font-extrabold text-green-600">
                  UGX {Number(lastOrder.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-2xl p-6 mb-8">
              Your order was submitted, but the order summary is not available
              in this browser session.
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            {customer && lastOrder && (
              <Link
                to={`/my-orders/${lastOrder.id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                <ClipboardList size={18} />
                View Order Details
              </Link>
            )}

            {customer && (
              <Link
                to="/my-orders"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                My Orders
              </Link>
            )}

            <Link
              to="/"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition inline-flex items-center gap-2"
            >
              <Home size={18} />
              Continue Shopping
            </Link>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition inline-flex items-center gap-2"
            >
              <MessageCircle size={18} />
              WhatsApp Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
      <MobileBottomNav />
    </div>
  );
}

export default OrderSuccess;