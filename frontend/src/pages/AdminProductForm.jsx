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
  const [imageName, setImageName] = useState("");

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

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

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
            setImageName("Current product image");
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
        image: file || null,
      });

      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setImageName(file.name);
      }

      return;
    }

    if (name === "name") {
      setFormData({
        ...formData,
        name: value,
        slug: generateSlug(value),
      });

      return;
    }

    if (name === "slug") {
      setFormData({
        ...formData,
        slug: generateSlug(value),
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const clearSelectedImage = () => {
    setFormData({
      ...formData,
      image: null,
    });

    setImagePreview(null);
    setImageName("");
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
            Product Management
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-500 mt-2">
            Add product details, pricing, stock information, and product image.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          {error && (
            <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
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
                    placeholder="Example: Lenovo ThinkPad X1 Yoga"
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
                    placeholder="example: lenovo-thinkpad-x1-yoga"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This is auto-generated from the product name, but you can still edit it.
                  </p>
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
                    placeholder="Enter price"
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
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>

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
                  placeholder="Describe the product clearly for customers"
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
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Product Image
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Upload a clear product image. Recommended image size is square or landscape.
              </p>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white mb-4"
              />

              {imagePreview ? (
                <div>
                  <div className="w-full h-64 bg-white rounded-2xl border border-gray-200 overflow-hidden mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {imageName}
                  </p>

                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="w-full border border-red-500 text-red-500 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition"
                    >
                      Remove Selected Image
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 bg-white rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-center px-4">
                  No image selected yet.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
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

            <button
              type="button"
              onClick={() => navigate("/admin-products")}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProductForm;