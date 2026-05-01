import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("orders/my-orders/")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Please login to view your orders.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
            Customer Account
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-gray-500 mt-2">
            Track the status of your Kubiz Market Place orders.
          </p>
        </div>

        {loading && (
          <p className="text-gray-600">Loading your orders...</p>
        )}

        {error && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-600 mb-4">
              You have not placed any orders yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-500">
                      Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                    {order.status}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-green-600 text-2xl font-extrabold">
                    UGX {Number(order.total_amount).toLocaleString()}
                  </p>

                  <Link
                    to={`/my-orders/${order.id}`}
                    className="inline-block mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Items
                  </h3>

                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between text-gray-700"
                      >
                        <span>
                          {item.product_name} × {item.quantity}
                        </span>
                        <span>
                          UGX {Number(item.subtotal).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyOrders;