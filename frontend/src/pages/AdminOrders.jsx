import { useEffect, useState } from "react";
import api from "../api/api";
import getCsrfToken from "../utils/getCsrfToken";
import AdminLayout from "../layouts/AdminLayout";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

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
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </p>
        )}

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
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
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
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="text-gray-600 py-6">No orders available.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;