import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import api from "../api/api";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("dashboard/summary/")
      .then((response) => {
        setSummary(response.data);
      })
      .catch(() => {
        setError("Failed to load dashboard data.");
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-red-600 text-lg">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const cards = [
    { label: "Total Orders", value: summary.total_orders },
    { label: "Pending Orders", value: summary.pending_orders },
    { label: "Confirmed Orders", value: summary.confirmed_orders },
    { label: "Processing Orders", value: summary.processing_orders },
    { label: "Delivered Orders", value: summary.delivered_orders },
    { label: "Cancelled Orders", value: summary.cancelled_orders },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
            Business Overview
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <p className="text-gray-500 text-sm mb-2">{card.label}</p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
          <p className="text-gray-500 text-sm mb-2">Delivered Revenue</p>
          <h2 className="text-4xl font-extrabold text-green-600">
            UGX {Number(summary.total_revenue).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Orders
          </h2>

          {summary.recent_orders.length === 0 ? (
            <p className="text-gray-600">No recent orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 pr-4">Order ID</th>
                    <th className="py-3 pr-4">Customer</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3 pr-4">City</th>
                    <th className="py-3 pr-4">Total</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recent_orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-4 pr-4">#{order.id}</td>
                      <td className="py-4 pr-4">{order.full_name}</td>
                      <td className="py-4 pr-4">{order.phone_number}</td>
                      <td className="py-4 pr-4">{order.city}</td>
                      <td className="py-4 pr-4 text-green-600 font-semibold">
                        UGX {Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="py-4 pr-4 capitalize">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default Dashboard;