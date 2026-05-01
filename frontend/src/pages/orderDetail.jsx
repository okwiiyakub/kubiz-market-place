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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            to="/my-orders"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to My Orders
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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

            <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-bold capitalize">
              {order.status}
            </span>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Customer Information
              </h2>

              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Name:</span> {order.full_name}
              </p>

              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Phone:</span>{" "}
                {order.phone_number}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Email:</span>{" "}
                {order.email || "Not provided"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Delivery Information
              </h2>

              <p className="text-gray-700 mb-2">
                <span className="font-semibold">City:</span> {order.city}
              </p>

              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Address:</span> {order.address}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Notes:</span>{" "}
                {order.notes || "No notes"}
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
                  className="flex justify-between gap-4 px-5 py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-bold text-gray-900">
                      {item.product_name}
                    </p>
                    <p className="text-gray-500 text-sm">
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
      </main>

      <Footer />
    </div>
  );
}

export default OrderDetail;