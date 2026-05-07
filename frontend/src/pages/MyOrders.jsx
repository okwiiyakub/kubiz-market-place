import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = filters.search.toLowerCase();

      const matchesSearch =
        String(order.id).includes(searchValue) ||
        String(order.full_name || "").toLowerCase().includes(searchValue) ||
        String(order.city || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        filters.status === "all" || order.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, filters]);

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      processing: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

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
            Track, search, and review your Kubiz Market Place orders.
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
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You have not placed any orders yet. Start shopping and your orders
              will appear here.
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
          <>
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Order Filters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Search by order ID, name, or city..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="md:col-span-2 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5">
                <p className="text-gray-500">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {filteredOrders.length}
                  </span>{" "}
                  order(s)
                </p>

                <button
                  onClick={clearFilters}
                  className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Clear Filters
                </button>
              </div>
            </section>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  No matching orders
                </h2>
                <p className="text-gray-600 mb-6">
                  No orders match your current search or status filter.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  View All Orders
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Order #{order.id}
                        </h2>
                        <p className="text-gray-500 mt-1">
                          Placed on{" "}
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>

                      {getStatusBadge(order.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-500 text-sm mb-1">Customer</p>
                        <p className="font-bold text-gray-900">
                          {order.full_name}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-500 text-sm mb-1">City</p>
                        <p className="font-bold text-gray-900">{order.city}</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-500 text-sm mb-1">Total</p>
                        <p className="font-bold text-green-600">
                          UGX {Number(order.total_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <p className="text-gray-500 text-sm">
                        Items ordered:{" "}
                        <span className="font-bold text-gray-900">
                          {order.items ? order.items.length : 0}
                        </span>
                      </p>

                      <Link
                        to={`/my-orders/${order.id}`}
                        className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center"
                      >
                        View Order Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyOrders;