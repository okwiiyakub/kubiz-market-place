import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Dashboard from "../pages/Dashboard";
import AdminLogin from "../pages/AdminLogin";
import AdminProducts from "../pages/AdminProducts";
import AdminProductForm from "../pages/AdminProductForm";
import AdminOrders from "../pages/AdminOrders";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-products" element={<AdminProducts />} />
        <Route path="/admin-products/new" element={<AdminProductForm />} />
        <Route path="/admin-products/edit/:id" element={<AdminProductForm />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;