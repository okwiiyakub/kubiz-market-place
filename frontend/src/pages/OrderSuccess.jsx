import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";

function OrderSuccess() {
  const lastOrder = JSON.parse(localStorage.getItem("kubiz-last-order"));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
            ✓
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Order Placed Successfully
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for shopping with Kubiz Market Place.
          </p>

          {lastOrder && (
            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <p className="mb-2">
                <span className="font-semibold">Customer:</span>{" "}
                {lastOrder.customer.fullName}
              </p>

              <p className="mb-2">
                <span className="font-semibold">Phone:</span>{" "}
                {lastOrder.customer.phoneNumber}
              </p>

              <p className="mb-2">
                <span className="font-semibold">Address:</span>{" "}
                {lastOrder.customer.address}, {lastOrder.customer.city}
              </p>

              <p className="mb-4">
                <span className="font-semibold">Total:</span>{" "}
                <span className="text-green-600 font-bold">
                  UGX {Number(lastOrder.total).toLocaleString()}
                </span>
              </p>

              <div>
                <p className="font-semibold mb-2">Items:</p>
                <ul className="space-y-2">
                  {lastOrder.items.map((item) => (
                    <li key={item.id} className="text-gray-700">
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>

            <Link
              to="/cart"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              View Cart
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default OrderSuccess;