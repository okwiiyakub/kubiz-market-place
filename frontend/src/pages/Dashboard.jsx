import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

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
  LineChart,
  Line,
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
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!summary) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </AdminLayout>
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
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

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

        {/* MONTHLY SALES TREND */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Monthly Sales Trend
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
            {summary.monthly_sales.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                No delivered sales data yet. Mark some orders as delivered to see the trend.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.monthly_sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `UGX ${Number(value).toLocaleString()}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Sales Revenue"
                    stroke="#16a34a"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
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

      </div>
    </AdminLayout>
  );
}

export default Dashboard;