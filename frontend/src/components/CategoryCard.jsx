function CategoryCard({ category }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition">
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
        <span className="text-blue-600 font-bold text-lg">
          {category.name.charAt(0)}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {category.name}
      </h3>

      <p className="text-gray-600 text-sm leading-6">
        {category.description || "Browse products and offers in this category."}
      </p>
    </div>
  );
}

export default CategoryCard;