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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;