import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-extrabold text-blue-400 mb-3">
            Kubiz Market Place
          </h3>

          <p className="text-gray-300 leading-7 max-w-xl">
            A modern marketplace for computers, phones, accessories, insurance
            services, digital products, and trusted business solutions in Uganda.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>

          <ul className="space-y-3 text-gray-300">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>

            <li>
              <a href="/#products" className="hover:text-blue-400 transition">
                Products
              </a>
            </li>

            <li>
              <a href="/#categories" className="hover:text-blue-400 transition">
                Categories
              </a>
            </li>

            <li>
              <Link to="/cart" className="hover:text-blue-400 transition">
                Cart
              </Link>
            </li>

            <li>
              <Link to="/my-orders" className="hover:text-blue-400 transition">
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">Contact</h4>

          <ul className="space-y-3 text-gray-300">
            <li>Kampala, Uganda</li>
            <li>Email: info@kubizmarketplace.com</li>
            <li>Phone: +256 XXX XXX XXX</li>
            <li>WhatsApp: +256 XXX XXX XXX</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-gray-400 text-sm">
          <p>© 2026 Kubiz Market Place. All rights reserved.</p>

          <p>
            Built for secure shopping, easy order tracking, and trusted customer
            support.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;