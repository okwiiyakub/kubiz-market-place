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

      fetchOrder();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
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

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            to="/admin-orders"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Order Manager
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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

            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 capitalize font-semibold"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Customer Details
              </h2>
              <p className="mb-2"><strong>Name:</strong> {order.full_name}</p>
              <p className="mb-2"><strong>Phone:</strong> {order.phone_number}</p>
              <p><strong>Email:</strong> {order.email || "Not provided"}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Delivery Details
              </h2>
              <p className="mb-2"><strong>City:</strong> {order.city}</p>
              <p className="mb-2"><strong>Address:</strong> {order.address}</p>
              <p><strong>Notes:</strong> {order.notes || "No notes"}</p>
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
                  className="flex justify-between px-5 py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-bold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold text-green-600">
                    UGX {Number(item.subtotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex justify-between items-center">
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