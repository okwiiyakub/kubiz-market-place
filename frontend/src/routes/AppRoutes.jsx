import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Dashboard from "../pages/Dashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminProductForm from "../pages/AdminProductForm";
import AdminOrders from "../pages/AdminOrders";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminReports from "../pages/AdminReports";
import Register from "../pages/Register";
import Login from "../pages/Login";
import MyOrders from "../pages/MyOrders";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer/public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Admin protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin-products"
          element={
            <ProtectedAdminRoute>
              <AdminProducts />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin-products/new"
          element={
            <ProtectedAdminRoute>
              <AdminProductForm />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin-products/edit/:id"
          element={
            <ProtectedAdminRoute>
              <AdminProductForm />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin-orders"
          element={
            <ProtectedAdminRoute>
              <AdminOrders />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin-reports"
          element={
            <ProtectedAdminRoute>
              <AdminReports />
            </ProtectedAdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;