import { useState } from "react";

function Navbar({ onSearch }) {
  const [searchText, setSearchText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-600">
              Kubiz Market Place
            </h1>
            <p className="text-sm text-gray-500">
              Your trusted marketplace for products and services
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-1 max-w-2xl mx-auto w-full"
          >
            <input
              type="text"
              placeholder="Search for products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-r-xl font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>

          <nav className="hidden md:flex items-center gap-6">
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
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;