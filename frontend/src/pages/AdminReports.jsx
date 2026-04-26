import { useEffect, useState } from "react";
import api from "../api/api";
import AdminLayout from "../layouts/AdminLayout";

function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [filterLabel, setFilterLabel] = useState("All Time");

  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchReport = (startDate = "", endDate = "", label = "All Time") => {
    let endpoint = "dashboard/summary/";
    const params = [];

    if (startDate) {
      params.push(`start_date=${startDate}`);
    }

    if (endDate) {
      params.push(`end_date=${endDate}`);
    }

    if (params.length > 0) {
      endpoint += `?${params.join("&")}`;
    }

    api.get(endpoint)
      .then((response) => {
        setSummary(response.data);
        setFilterLabel(label);
      })
      .catch(() => setError("Failed to load report data."));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filterToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    fetchReport(today, today, "Today");
  };

  const filterThisMonth = () => {
    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);

    fetchReport(startDate, endDate, "This Month");
  };

  const clearFilter = () => {
    setCustomDates({ startDate: "", endDate: "" });
    fetchReport("", "", "All Time");
  };

  const applyCustomFilter = () => {
    if (!customDates.startDate || !customDates.endDate) {
      alert("Please select both start date and end date.");
      return;
    }

    fetchReport(
      customDates.startDate,
      customDates.endDate,
      `${customDates.startDate} to ${customDates.endDate}`
    );
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!summary) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600">Loading report...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 print:block">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Kubiz Market Place Report
            </h1>
            <p className="text-gray-500 mt-2">
              Orders, revenue, and product summary
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Filter: {filterLabel}
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

        <section className="print:hidden bg-white rounded-2xl border p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">Report Filters</h2>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={filterToday}
              className="bg-blue-100 text-blue-700 px-5 py-2 rounded-xl font-semibold hover:bg-blue-200 transition"
            >
              Today
            </button>

            <button
              onClick={filterThisMonth}
              className="bg-green-100 text-green-700 px-5 py-2 rounded-xl font-semibold hover:bg-green-200 transition"
            >
              This Month
            </button>

            <button
              onClick={clearFilter}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              All Time
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              value={customDates.startDate}
              onChange={(e) =>
                setCustomDates({ ...customDates, startDate: e.target.value })
              }
              className="border border-gray-300 rounded-xl px-4 py-3"
            />

            <input
              type="date"
              value={customDates.endDate}
              onChange={(e) =>
                setCustomDates({ ...customDates, endDate: e.target.value })
              }
              className="border border-gray-300 rounded-xl px-4 py-3"
            />

            <button
              onClick={applyCustomFilter}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Apply Custom Range
            </button>
          </div>
        </section>

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
      </div>
    </AdminLayout>
  );
}

export default AdminReports;