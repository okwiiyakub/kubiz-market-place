import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import getCsrfToken from "../utils/getCsrfToken";
import AdminLayout from "../layouts/AdminLayout";

function AdminOrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const statusSteps = ["pending", "confirmed", "processing", "delivered"];

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    processing: "bg-purple-100 text-purple-700 border-purple-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  const fetchOrder = () => {
    api.get(`orders/admin/manage/${id}/`)
      .then((response) => {
        setOrder(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order details.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    if (!order || newStatus === order.status) return;

    const confirmUpdate = window.confirm(
      `Are you sure you want to change this order status to "${newStatus}"?`
    );

    if (!confirmUpdate) return;

    setStatusLoading(true);
    setSuccessMessage("");

    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      await api.patch(
        `orders/admin/manage/${id}/`,
        { status: newStatus },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setSuccessMessage(`Order status updated to ${newStatus}.`);
      fetchOrder();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-gray-600">Loading order details...</p>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <p className="text-red-600 mb-4">{error}</p>

          <Link
            to="/admin-orders"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const whatsappNumber = order.phone_number
    ? order.phone_number.replace(/\D/g, "")
    : "";

  const whatsappMessage = `Hello ${order.full_name}, your Kubiz Market Place Order #${order.id} is currently ${order.status}.`;

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto print:max-w-full">
        <div className="mb-8 print:hidden">
          <Link
            to="/admin-orders"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Order Manager
          </Link>
        </div>

        {successMessage && (
          <p className="print:hidden bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-6">
            {successMessage}
          </p>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                Admin Order Details
              </p>

              <h1 className="text-4xl font-extrabold text-gray-900">
                Order #{order.id}
              </h1>

              <p className="text-gray-500 mt-2">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={statusLoading}
                className="border border-gray-300 rounded-xl px-4 py-3 capitalize font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={handlePrint}
                className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Print Invoice
              </button>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-gray-500 text-sm mb-1">Customer</p>
              <h3 className="text-lg font-bold text-gray-900">
                {order.full_name}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-gray-500 text-sm mb-1">City</p>
              <h3 className="text-lg font-bold text-gray-900">
                {order.city}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-gray-500 text-sm mb-1">Total</p>
              <h3 className="text-lg font-bold text-green-600">
                UGX {Number(order.total_amount).toLocaleString()}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-gray-500 text-sm mb-1">Status</p>
              <span
                className={`inline-block px-4 py-2 rounded-full border text-sm font-bold capitalize ${
                  statusStyles[order.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </section>

          {order.status !== "cancelled" && (
            <section className="mb-10 print:hidden">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Order Progress
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;

                  return (
                    <div
                      key={step}
                      className={`rounded-2xl border p-5 ${
                        isCompleted
                          ? "bg-blue-50 border-blue-100 text-blue-700"
                          : "bg-gray-50 border-gray-100 text-gray-400"
                      }`}
                    >
                      <p className="text-sm font-semibold uppercase">
                        Step {index + 1}
                      </p>
                      <h3 className="text-lg font-bold capitalize mt-1">
                        {step}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Customer Details
              </h2>

              <p className="mb-2">
                <strong>Name:</strong> {order.full_name}
              </p>

              <p className="mb-2">
                <strong>Phone:</strong> {order.phone_number}
              </p>

              <p>
                <strong>Email:</strong> {order.email || "Not provided"}
              </p>

              {whatsappNumber && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="print:hidden inline-block mt-5 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Message Customer on WhatsApp
                </a>
              )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Delivery Details
              </h2>

              <p className="mb-2">
                <strong>City:</strong> {order.city}
              </p>

              <p className="mb-2">
                <strong>Address:</strong> {order.address}
              </p>

              <p>
                <strong>Notes:</strong> {order.notes || "No notes"}
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Ordered Items
            </h2>

            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 px-5 py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="md:col-span-2">
                    <p className="font-bold text-gray-900">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Product ordered by customer
                    </p>
                  </div>

                  <p className="text-gray-700">
                    <strong>Quantity:</strong> {item.quantity}
                  </p>

                  <p className="font-bold text-green-600 md:text-right">
                    UGX {Number(item.subtotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <span className="text-xl font-bold text-gray-900">
              Total Amount
            </span>

            <span className="text-3xl font-extrabold text-green-600">
              UGX {Number(order.total_amount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrderDetail;