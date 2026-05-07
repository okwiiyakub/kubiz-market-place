import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const statusSteps = ["pending", "confirmed", "processing", "delivered"];

  useEffect(() => {
    api.get("orders/my-orders/")
      .then((response) => {
        const foundOrder = response.data.find(
          (item) => String(item.id) === String(id)
        );

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError("Order not found.");
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Please login to view this order.");
        setLoading(false);
      });
  }, [id]);

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
        className={`px-5 py-2 rounded-full text-sm font-bold capitalize ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-gray-600">Loading order details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>

            <Link
              to="/my-orders"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Back to My Orders
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);

  const whatsappNumber = "2567XXXXXXXX"; // replace with your real WhatsApp number

  const whatsappMessage = `Hello, I need support with my Kubiz Market Place Order #${order.id}.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 print:max-w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 print:hidden">
          <Link
            to="/my-orders"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to My Orders
          </Link>

          <button
            onClick={handlePrint}
            className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Print Order
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                Order Details
              </p>

              <h1 className="text-4xl font-extrabold text-gray-900">
                Order #{order.id}
              </h1>

              <p className="text-gray-500 mt-2">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            {getStatusBadge(order.status)}
          </div>

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

          {order.status === "cancelled" && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-5 mb-10">
              This order was cancelled. Please contact Kubiz Market Place support
              if you need help.
            </div>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
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
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Customer Information
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
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Delivery Information
              </h2>

              <p className="mb-2">
                <strong>Address:</strong> {order.address}
              </p>

              <p className="mb-2">
                <strong>City:</strong> {order.city}
              </p>

              <p>
                <strong>Notes:</strong> {order.notes || "No delivery notes"}
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
                      Item included in this order
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

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <span className="text-xl font-bold text-gray-900">
              Total Amount
            </span>

            <span className="text-3xl font-extrabold text-green-600">
              UGX {Number(order.total_amount).toLocaleString()}
            </span>
          </div>

          <div className="print:hidden bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Need help with this order?
              </h3>

              <p className="text-gray-600 mt-1">
                Contact Kubiz Market Place support and mention your order number.
              </p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition text-center"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderDetail;