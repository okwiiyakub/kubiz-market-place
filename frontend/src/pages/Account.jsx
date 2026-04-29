import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function Account() {
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("accounts/me/")
      .then((response) => {
        setCustomer(response.data);
        setFormData({
          full_name: response.data.full_name,
        });
      })
      .catch(() => {
        setError("Please login to access your account.");
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      full_name: e.target.value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    api.patch("accounts/me/", formData)
      .then(() => {
        setMessage("Profile updated successfully.");
      })
      .catch(() => {
        setError("Failed to update profile.");
      });
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-red-600">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
            Customer Account
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900">
            My Profile
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {message && (
            <p className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-6">
              {message}
            </p>
          )}

          <form onSubmit={handleUpdate}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={customer.email}
                disabled
                className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3"
              />
            </div>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Update Profile
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Account;