import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";
import getCsrfToken from "../utils/getCsrfToken";

function Account() {
  const [customer, setCustomer] = useState(null);

  const [profileData, setProfileData] = useState({
    full_name: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    api.get("accounts/me/")
      .then((response) => {
        setCustomer(response.data);
        setProfileData({
          full_name: response.data.full_name || "",
        });
      })
      .catch(() => {
        setError("Please login to access your account.");
      });
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      full_name: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    setProfileLoading(true);
    setProfileMessage("");
    setError("");

    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      const response = await api.patch("accounts/me/", profileData, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      setCustomer(response.data);
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setError("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);

    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      await api.post(
        "accounts/change-password/",
        {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setPasswordMessage("Password changed successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to change password. Please check your current password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-red-600">{error || "Loading account..."}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
            Customer Account
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900">
            My Account
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your Kubiz Market Place profile and account security.
          </p>
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Profile Information
            </h2>

            <p className="text-gray-500 mb-6">
              Update your name and view your registered email address.
            </p>

            {profileMessage && (
              <p className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-6">
                {profileMessage}
              </p>
            )}

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={customer.email}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {profileLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Change Password
            </h2>

            <p className="text-gray-500 mb-6">
              Use this section to update your login password.
            </p>

            {passwordMessage && (
              <p className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-6">
                {passwordMessage}
              </p>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Account;