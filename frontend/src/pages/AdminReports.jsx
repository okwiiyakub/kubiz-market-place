import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("dashboard/summary/")
      .then((response) => setSummary(response.data))
      .catch(() => setError("Failed to load report data."));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!summary) return <p className="p-8 text-gray-600">Loading report...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 print:block">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Kubiz Market Place Report
            </h1>
            <p className="text-gray-500 mt-2">
              Orders, revenue, and product summary
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Generated on: {new Date().toLocaleString()}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="print:hidden bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Print Report
          </button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-bold">{summary.total_orders}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-gray-500">Delivered Revenue</p>
            <h2 className="text-3xl font-bold text-green-600">
              UGX {Number(summary.total_revenue).toLocaleString()}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-gray-500">Total Products</p>
            <h2 className="text-3xl font-bold">{summary.total_products}</h2>
          </div>
        </section>

        <section className="bg-white rounded-2xl border p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">Order Status Summary</h2>

          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-3">Pending Orders</td>
                <td className="py-3 font-semibold">{summary.pending_orders}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Confirmed Orders</td>
                <td className="py-3 font-semibold">{summary.confirmed_orders}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Processing Orders</td>
                <td className="py-3 font-semibold">{summary.processing_orders}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Delivered Orders</td>
                <td className="py-3 font-semibold">{summary.delivered_orders}</td>
              </tr>
              <tr>
                <td className="py-3">Cancelled Orders</td>
                <td className="py-3 font-semibold">{summary.cancelled_orders}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-2xl border p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">Products by Category</h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3">Category</th>
                <th className="py-3">Products</th>
              </tr>
            </thead>
            <tbody>
              {summary.products_by_category.map((category, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{category.name}</td>
                  <td className="py-3 font-semibold">{category.product_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-2xl border p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3">Order</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Phone</th>
                <th className="py-3">City</th>
                <th className="py-3">Total</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {summary.recent_orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3">#{order.id}</td>
                  <td className="py-3">{order.full_name}</td>
                  <td className="py-3">{order.phone_number}</td>
                  <td className="py-3">{order.city}</td>
                  <td className="py-3">
                    UGX {Number(order.total_amount).toLocaleString()}
                  </td>
                  <td className="py-3 capitalize">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default AdminReports;