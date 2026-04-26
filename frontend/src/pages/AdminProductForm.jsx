import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import getCsrfToken from "../utils/getCsrfToken";
import AdminLayout from "../layouts/AdminLayout";

function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    stock_quantity: "",
    image: null,
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    api.get("categories/")
      .then((response) => {
        setCategories(response.data);
      })
      .catch(() => {
        setError("Failed to load categories.");
      });
  }, []);

  useEffect(() => {
    if (isEditMode) {
      api.get(`products/admin/manage/${id}/`)
        .then((response) => {
          const product = response.data;

          setFormData({
            category: product.category,
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            price: product.price,
            stock_quantity: product.stock_quantity,
            image: null,
            is_active: product.is_active,
            is_featured: product.is_featured,
          });

          if (product.image) {
            setImagePreview(
              product.image.startsWith("http")
                ? product.image
                : `http://localhost:8000${product.image}`
            );
          }
        })
        .catch(() => {
          setError("Failed to load product details.");
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setFormData({
        ...formData,
        image: file,
      });

      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      const productData = new FormData();
      productData.append("category", formData.category);
      productData.append("name", formData.name);
      productData.append("slug", formData.slug);
      productData.append("description", formData.description);
      productData.append("price", formData.price);
      productData.append("stock_quantity", formData.stock_quantity);
      productData.append("is_active", formData.is_active);
      productData.append("is_featured", formData.is_featured);

      if (formData.image) {
        productData.append("image", formData.image);
      }

      if (isEditMode) {
        await api.patch(`products/admin/manage/${id}/`, productData, {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        });
      } else {
        await api.post("products/admin/manage/", productData, {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        });
      }

      navigate("/admin-products");
    } catch (err) {
      console.error(err);
      setError(isEditMode ? "Failed to update product." : "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          {error && (
            <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
              />
            </div>
          </div>

          {imagePreview && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Image Preview
              </p>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-xl border border-gray-200"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            ></textarea>
          </div>

          <div className="flex flex-wrap gap-6 mb-8">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              Featured
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update Product"
                : "Create Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProductForm;