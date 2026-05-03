import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import getCsrfToken from "../utils/getCsrfToken";
import AdminLayout from "../layouts/AdminLayout";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  const fetchOrders = () => {
    api.get("orders/admin/manage/")
      .then((response) => {
        setOrders(response.data);
      })
      .catch(() => {
        setError("Failed to load orders.");
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      await api.patch(
        `orders/admin/manage/${orderId}/`,
        { status: newStatus },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchValue = filters.search.toLowerCase();

    const matchesSearch =
      String(order.id).includes(searchValue) ||
      String(order.full_name || "").toLowerCase().includes(searchValue) ||
      String(order.phone_number || "").toLowerCase().includes(searchValue) ||
      String(order.city || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      filters.status === "all" || order.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
            Admin Management
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Order Manager
          </h1>
          <p className="text-gray-500 mt-2">
            Search, filter, review, and update customer orders.
          </p>
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </p>
        )}

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Order Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by order ID, customer, phone, or city..."
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
              of{" "}
              <span className="font-bold text-gray-900">
                {orders.length}
              </span>{" "}
              orders
            </p>

            <button
              onClick={clearFilters}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </section>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">City</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Items</th>
                <th className="py-3 pr-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 align-top">
                  <td className="py-4 pr-4 font-semibold">#{order.id}</td>
                  <td className="py-4 pr-4">{order.full_name}</td>
                  <td className="py-4 pr-4">{order.phone_number}</td>
                  <td className="py-4 pr-4">{order.city}</td>
                  <td className="py-4 pr-4 text-green-600 font-bold">
                    UGX {Number(order.total_amount).toLocaleString()}
                  </td>
                  <td className="py-4 pr-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 pr-4">
                    <ul className="space-y-1 text-sm text-gray-600">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.product_name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 pr-4">
                    <Link
                      to={`/admin-orders/${order.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <p className="text-gray-600 py-6">
              No orders match the selected filters.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;