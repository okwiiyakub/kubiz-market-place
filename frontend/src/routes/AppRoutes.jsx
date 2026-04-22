import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;