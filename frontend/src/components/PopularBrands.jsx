function PopularBrands() {
  const brands = [
    "Apple",
    "Samsung",
    "HP",
    "Dell",
    "Lenovo",
    "Asus",
    "Acer",
    "Canon",
    "Epson",
    "Huawei",
    "Tecno",
    "Infinix",
    "Nike",
    "Adidas",
  ];

  return (
    <section className="bg-white border-b border-gray-100 overflow-hidden py-5">
      <div className="max-w-7xl mx-auto px-6 mb-3">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
          Popular Brands Available on Kubiz Market Place
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-6">
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-100 px-6 py-3 rounded-xl text-gray-700 font-bold shadow-sm min-w-fit"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularBrands;