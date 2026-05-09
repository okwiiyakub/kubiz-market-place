import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle,
  ClipboardList,
  Clock,
  Eye,
  Package,
  PackageCheck,
  PackageX,
  ShoppingBag,
  Store,
  TrendingUp,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";

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
  const [summary, setSummary] = useState(null);
  const [adminProducts, setAdminProducts] = useState([]);
  const [error, setError] = useState("");
  const [stockAlertError, setStockAlertError] = useState("");

  useEffect(() => {
    api.get("dashboard/summary/")
      .then((response) => {
        setSummary(response.data);
      })
      .catch(() => {
        setError(
          "Failed to load dashboard summary. Please make sure the Django backend is running."
        );
      });

    api.get("products/admin/manage/")
      .then((response) => {
        setAdminProducts(response.data);
      })
      .catch(() => {
        setAdminProducts([]);
        setStockAlertError(
          "Stock alerts could not be loaded, but the dashboard is still available."
        );
      });
  }, []);

  if (!summary && !error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center gap-3 text-gray-600">
            <BarChart3 size={22} />
            Loading dashboard...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!summary && error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-6 flex items-center gap-3">
            <AlertTriangle size={22} />
            {error}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const productsByCategory = summary.products_by_category || [];
  const monthlySales = summary.monthly_sales || [];
  const recentOrders = summary.recent_orders || [];

  const lowStockProducts = adminProducts.filter(
    (product) => product.stock_quantity > 0 && product.stock_quantity <= 5
  );

  const outOfStockProducts = adminProducts.filter(
    (product) => product.stock_quantity <= 0
  );

  const orderCards = [
    { label: "Total Orders", value: summary.total_orders, icon: ShoppingBag },
    { label: "Pending Orders", value: summary.pending_orders, icon: Clock },
    { label: "Confirmed Orders", value: summary.confirmed_orders, icon: CheckCircle },
    { label: "Processing Orders", value: summary.processing_orders, icon: Truck },
    { label: "Delivered Orders", value: summary.delivered_orders, icon: PackageCheck },
    { label: "Cancelled Orders", value: summary.cancelled_orders, icon: XCircle },
  ];

  const productCards = [
    { label: "Total Products", value: summary.total_products, icon: Boxes },
    { label: "Active Products", value: summary.active_products, icon: PackageCheck },
    { label: "Inactive Products", value: summary.inactive_products, icon: PackageX },
    { label: "Low Stock Products", value: lowStockProducts.length, icon: AlertTriangle },
    { label: "Out of Stock Products", value: outOfStockProducts.length, icon: PackageX },
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
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm flex items-center gap-2">
            <BarChart3 size={16} />
            Business Overview
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Marketplace Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor orders, revenue, products, stock alerts, and recent activity.
          </p>
        </div>

        {stockAlertError && (
          <p className="bg-yellow-50 border border-yellow-100 text-yellow-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-2">
            <AlertTriangle size={18} />
            {stockAlertError}
          </p>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
              <Boxes size={24} />
            </div>
            <p className="text-gray-500 text-sm mb-2">Total Products</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {summary.total_products}
            </h2>
          </div>

          <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-100 p-6">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <p className="text-yellow-700 text-sm mb-2">Low Stock Products</p>
            <h2 className="text-3xl font-extrabold text-yellow-700">
              {lowStockProducts.length}
            </h2>
          </div>

          <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center mb-4">
              <PackageX size={24} />
            </div>
            <p className="text-red-700 text-sm mb-2">Out of Stock Products</p>
            <h2 className="text-3xl font-extrabold text-red-700">
              {outOfStockProducts.length}
            </h2>
          </div>
        </section>

        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={24} className="text-yellow-600" />
                  Inventory Alerts
                </h2>
                <p className="text-gray-500 mt-1">
                  Products that may need urgent restocking.
                </p>
              </div>

              <Link
                to="/admin-products"
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Package size={18} />
                Open Product Manager
              </Link>
            </div>

            <div className="space-y-3">
              {[...outOfStockProducts, ...lowStockProducts]
                .slice(0, 8)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-xl p-4"
                  >
                    <div>
                      <p className="font-bold text-gray-900 flex items-center gap-2">
                        <Package size={17} />
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.category_name}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-gray-700">
                        Stock: {product.stock_quantity}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          product.stock_quantity <= 0
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.stock_quantity <= 0 ? (
                          <PackageX size={13} />
                        ) : (
                          <AlertTriangle size={13} />
                        )}
                        {product.stock_quantity <= 0
                          ? "Out of Stock"
                          : "Low Stock"}
                      </span>

                      <Link
                        to={`/admin-products/edit/${product.id}`}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ClipboardList size={24} />
            Order Analytics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="w-11 h-11 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>

                  <p className="text-gray-500 text-sm mb-2">{card.label}</p>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {card.value}
                  </h2>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChartIcon />
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

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package size={24} />
            Product Analytics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {productCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="w-11 h-11 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>

                  <p className="text-gray-500 text-sm mb-2">{card.label}</p>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {card.value}
                  </h2>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Store size={24} />
            Products by Category
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {productsByCategory.length === 0 ? (
              <p className="text-gray-500">No category data available.</p>
            ) : (
              productsByCategory.map((category, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-gray-100 py-3"
                >
                  <span>{category.name}</span>
                  <span className="font-semibold">
                    {category.product_count}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={24} />
            Products by Category Chart
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
            {productsByCategory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                No product category chart data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="product_count" name="Products" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-4">
              <Wallet size={24} />
            </div>

            <p className="text-gray-500 text-sm mb-2">Delivered Revenue</p>

            <h2 className="text-4xl font-extrabold text-green-600">
              UGX {Number(summary.total_revenue).toLocaleString()}
            </h2>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} />
            Monthly Sales Trend
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
            {monthlySales.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                No delivered sales data yet. Mark some orders as delivered to
                see the trend.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      `UGX ${Number(value).toLocaleString()}`
                    }
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

        <section>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag size={24} />
                  Recent Orders
                </h2>
                <p className="text-gray-500 mt-1">
                  Quick access to the latest customer orders.
                </p>
              </div>

              <Link
                to="/admin-orders"
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <ClipboardList size={18} />
                View All Orders
              </Link>
            </div>

            {recentOrders.length === 0 ? (
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
                      <th className="py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-4">#{order.id}</td>
                        <td className="py-4">{order.full_name}</td>
                        <td className="py-4">{order.phone_number}</td>
                        <td className="py-4">{order.city}</td>
                        <td className="py-4 text-green-600 font-semibold">
                          UGX {Number(order.total_amount).toLocaleString()}
                        </td>
                        <td className="py-4 capitalize">{order.status}</td>
                        <td className="py-4">
                          <Link
                            to={`/admin-orders/${order.id}`}
                            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition inline-flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View
                          </Link>
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

function PieChartIcon() {
  return <BarChart3 size={24} />;
}

export default Dashboard;