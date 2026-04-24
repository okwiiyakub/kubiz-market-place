import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("dashboard/summary/")
      .then((response) => {
        setSummary(response.data);
      })
      .catch(() => {
        navigate("/");
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

  const orderCards = [
    { label: "Total Orders", value: summary.total_orders },
    { label: "Pending Orders", value: summary.pending_orders },
    { label: "Confirmed Orders", value: summary.confirmed_orders },
    { label: "Processing Orders", value: summary.processing_orders },
    { label: "Delivered Orders", value: summary.delivered_orders },
    { label: "Cancelled Orders", value: summary.cancelled_orders },
  ];

  const productCards = [
    { label: "Total Products", value: summary.total_products },
    { label: "Active Products", value: summary.active_products },
    { label: "Inactive Products", value: summary.inactive_products },
    { label: "Low Stock Products", value: summary.low_stock_products },
  ];
  
  const orderStatusData = [
    { name: "Pending", value: summary.pending_orders },
    { name: "Confirmed", value: summary.confirmed_orders },
    { name: "Processing", value: summary.processing_orders },
    { name: "Delivered", value: summary.delivered_orders },
    { name: "Cancelled", value: summary.cancelled_orders },
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#22c55e", "#ef4444"];
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
            Business Overview
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Marketplace Dashboard
          </h1>
        </div>


        {/* ORDER ANALYTICS */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Analytics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderCards.map((card, index) => (
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
        </section>


        {/* ORDERS BY STATUS CHART */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Orders by Status
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* PRODUCT ANALYTICS */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Product Analytics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCards.map((card, index) => (
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
        </section>


        {/* CATEGORY DISTRIBUTION */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Products by Category
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {summary.products_by_category.map((category, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-gray-100 py-3"
              >
                <span>{category.name}</span>
                <span className="font-semibold">
                  {category.product_count}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* PRODUCTS BY CATEGORY BAR CHART */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Products by Category Chart
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.products_by_category}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="product_count" name="Products" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>


        {/* REVENUE */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500 text-sm mb-2">
              Delivered Revenue
            </p>

            <h2 className="text-4xl font-extrabold text-green-600">
              UGX {Number(summary.total_revenue).toLocaleString()}
            </h2>
          </div>
        </section>


        {/* RECENT ORDERS */}
        <section>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Orders
            </h2>

            {summary.recent_orders.length === 0 ? (
              <p className="text-gray-600">No recent orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3">Order ID</th>
                      <th className="py-3">Customer</th>
                      <th className="py-3">Phone</th>
                      <th className="py-3">City</th>
                      <th className="py-3">Total</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.recent_orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-4">#{order.id}</td>
                        <td className="py-4">{order.full_name}</td>
                        <td className="py-4">{order.phone_number}</td>
                        <td className="py-4">{order.city}</td>
                        <td className="py-4 text-green-600 font-semibold">
                          UGX {Number(order.total_amount).toLocaleString()}
                        </td>
                        <td className="py-4 capitalize">
                          {order.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default Dashboard;