import { Link, useLocation } from "react-router-dom";
import { Home, Heart, ShoppingCart, ClipboardList, User } from "lucide-react";
import { useCart } from "../context/CartContext";

function MobileBottomNav() {
  const location = useLocation();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const wishlistCount =
    JSON.parse(localStorage.getItem("kubiz-wishlist"))?.length || 0;

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Wishlist", path: "/wishlist", icon: Heart, count: wishlistCount },
    { label: "Cart", path: "/cart", icon: ShoppingCart, count: cartCount },
    { label: "Orders", path: "/my-orders", icon: ClipboardList },
    { label: "Account", path: "/account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-2 text-xs font-semibold ${
                isActive(item.path)
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <div className="relative">
                <Icon size={21} />

                {item.count > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>

              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MobileBottomNav;