import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import getCsrfToken from "../utils/getCsrfToken";
import AdminLayout from "../layouts/AdminLayout";

function AdminOrders() {
  const ORDERS_PER_PAGE = 8;

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

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
    const confirmUpdate = window.confirm(
      `Are you sure you want to change this order status to "${newStatus}"?`
    );

    if (!confirmUpdate) return;

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

  const sortedOrders = useMemo(() => {
    const orderCopy = [...filteredOrders];

    if (sortOption === "oldest") {
      return orderCopy.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }

    if (sortOption === "amount-high") {
      return orderCopy.sort(
        (a, b) => Number(b.total_amount) - Number(a.total_amount)
      );
    }

    if (sortOption === "amount-low") {
      return orderCopy.sort(
        (a, b) => Number(a.total_amount) - Number(b.total_amount)
      );
    }

    if (sortOption === "customer-az") {
      return orderCopy.sort((a, b) =>
        String(a.full_name || "").localeCompare(String(b.full_name || ""))
      );
    }

    return orderCopy.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [filteredOrders, sortOption]);

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
    });
    setSortOption("newest");
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
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
        className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
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
            Search, filter, sort, review, and update customer orders.
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by order ID, customer, phone, or city..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="md:col-span-2 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount-high">Sort: Amount High to Low</option>
              <option value="amount-low">Sort: Amount Low to High</option>
              <option value="customer-az">Sort: Customer A to Z</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5">
            <p className="text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {sortedOrders.length}
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 pr-4">Order ID</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">City</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Update</th>
                <th className="py-3 pr-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-bold text-gray-900">
                    #{order.id}
                  </td>

                  <td className="py-4 pr-4">{order.full_name}</td>

                  <td className="py-4 pr-4">{order.phone_number}</td>

                  <td className="py-4 pr-4">{order.city}</td>

                  <td className="py-4 pr-4 text-green-600 font-semibold">
                    UGX {Number(order.total_amount).toLocaleString()}
                  </td>

                  <td className="py-4 pr-4">
                    {getStatusBadge(order.status)}
                  </td>

                  <td className="py-4 pr-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-4 pr-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-4 pr-4">
                    <Link
                      to={`/admin-orders/${order.id}`}
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedOrders.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-5">
                No customer orders match your current filters.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                View All Orders
              </button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-gray-600">
              Page{" "}
              <span className="font-bold text-gray-900">{currentPage}</span>{" "}
              of <span className="font-bold text-gray-900">{totalPages}</span>
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;