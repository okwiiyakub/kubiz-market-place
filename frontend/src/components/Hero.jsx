import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          <p className="uppercase tracking-widest text-sm font-semibold mb-4 text-blue-100">
            Welcome to Kubiz Market Place
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Buy Computers, Phones, Insurance Services, and Digital Products in One Place
          </h2>

          <p className="text-lg text-blue-100 mb-8">
            Discover quality products, trusted services, and the best deals for your personal and business needs.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Shop Now
            </a>

            <a
              href="#categories"
              className="border border-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-blue-700 transition"
            >
              Explore Categories
            </a>
          </div>

          {/* TRUST INDICATORS */}
          <div className="flex flex-wrap gap-6 mt-10 text-blue-100 text-sm font-medium">
            <span>✔ Trusted Products</span>
            <span>✔ Secure Orders</span>
            <span>✔ Fast Support</span>
          </div>
        </div>

        {/* RIGHT FEATURE CARDS */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white text-gray-800 rounded-2xl p-5 shadow-md">
              <h3 className="font-bold text-lg mb-2">Computers</h3>
              <p className="text-sm text-gray-600">
                Laptops, desktops, accessories
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-2xl p-5 shadow-md">
              <h3 className="font-bold text-lg mb-2">Phones</h3>
              <p className="text-sm text-gray-600">
                Smartphones and mobile accessories
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-2xl p-5 shadow-md">
              <h3 className="font-bold text-lg mb-2">Insurance</h3>
              <p className="text-sm text-gray-600">
                Trusted protection services
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-2xl p-5 shadow-md">
              <h3 className="font-bold text-lg mb-2">Digital</h3>
              <p className="text-sm text-gray-600">
                Software and online products
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;