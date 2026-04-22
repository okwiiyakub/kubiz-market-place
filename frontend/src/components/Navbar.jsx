function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-600">
            Kubiz Market Place
          </h1>
          <p className="text-sm text-gray-500">
            Your trusted marketplace for products and services
          </p>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
            Categories
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
            Products
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
            Services
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
            Contact
          </a>
        </nav>

        <div className="hidden md:block">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;