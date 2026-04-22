function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-blue-400 mb-3">
            Kubiz Market Place
          </h3>
          <p className="text-gray-300 leading-7">
            A modern marketplace for computers, phones, insurance services, accessories, and digital products.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Home</li>
            <li>Products</li>
            <li>Categories</li>
            <li>Services</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <p className="text-gray-300">Kampala, Uganda</p>
          <p className="text-gray-300">Email: info@kubizmarketplace.com</p>
          <p className="text-gray-300">Phone: +256 XXX XXX XXX</p>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-gray-400 text-sm">
        © 2026 Kubiz Market Place. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;