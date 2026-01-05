'use client';

import { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchAllProducts, updateProduct, deleteProduct } from '@/lib/redux/slices/adminProductsSlice';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

/**
 * Edit Product
 * Prefilled form with update/delete actions
 */
export default function EditProductPage({ params }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { products, isSaving } = useSelector((state) => state.adminProducts);
  
  const unwrappedParams = use(params);
  const productId = parseInt(unwrappedParams.id);
  const product = products.find((p) => p.id === productId);

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.email && products.length === 0) {
      dispatch(fetchAllProducts({ type: 'products', userId: user.email }));
    }
  }, [dispatch, user, products.length]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'Electronics',
        price: product.price || '',
        discountPercentage: product.discountPercentage || product.discount || '',
        stock: product.stock || '',
        images: product.images?.length > 0 ? product.images : [product.image || ''],
        tags: product.tags?.join(', ') || '',
        isDeal: product.isDeal || false,
        dealExpiry: product.dealExpiry || '',
        isActive: product.isActive !== false,
      });
    }
  }, [product]);

  const categories = ['Electronics', 'Clothing', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (index, value) => {
    if (!formData?.images) return;
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    if (!formData?.images || formData.images.length >= 5) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const removeImageField = (index) => {
    if (!formData?.images || formData.images.length <= 1) return;
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const validate = () => {
    if (!formData) return false;
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (formData.stock === '' || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.images || formData.images.filter(img => img.trim()).length === 0) {
      newErrors.images = 'At least one image URL is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix validation errors');
      return;
    }

    const updates = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
      stock: parseInt(formData.stock),
      images: formData.images.filter(img => img.trim()),
      image: formData.images.filter(img => img.trim())[0] || '',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      isDeal: formData.isDeal,
      dealExpiry: formData.dealExpiry || null,
      isActive: formData.isActive,
    };

    try {
      await dispatch(updateProduct({ productId, updates, userId: user.email })).unwrap();
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error || 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to deactivate this product?')) {
      return;
    }

    try {
      await dispatch(deleteProduct({ productId, userId: user.email })).unwrap();
      toast.success('Product deactivated');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error || 'Failed to delete product');
    }
  };

  if (!formData) {
    return (
      <div className="p-8">
        <p className="text-neutral-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-medium text-neutral-900">Edit Product</h1>
            <p className="text-sm text-neutral-500 mt-1">ID: {productId}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
          Deactivate
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                  errors.name ? 'border-red-500' : 'border-neutral-200'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                  errors.description ? 'border-red-500' : 'border-neutral-200'
                }`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                  errors.price ? 'border-red-500' : 'border-neutral-200'
                }`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
                className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {formData.price && formData.discountPercentage && (
            <div className="mt-3 p-3 bg-neutral-50 rounded-md">
              <p className="text-sm text-neutral-700">
                Final Price:{' '}
                <span className="font-medium">
                  ₹{(parseFloat(formData.price) * (1 - parseFloat(formData.discountPercentage) / 100)).toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Inventory</h2>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                errors.stock ? 'border-red-500' : 'border-neutral-200'
              }`}
            />
            {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Media</h2>
          <div className="space-y-3">
            {formData?.images?.map((img, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
            {formData?.images && formData.images.length < 5 && (
              <button
                type="button"
                onClick={addImageField}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                + Add another image
              </button>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        {/* Deal Settings */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Deal Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDeal"
                checked={formData.isDeal}
                onChange={handleChange}
                className="w-4 h-4 text-neutral-900 rounded focus:ring-2 focus:ring-neutral-900"
              />
              <span className="text-sm text-neutral-700">Mark as Deal</span>
            </label>

            {formData.isDeal && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Deal Expiry Date
                </label>
                <input
                  type="datetime-local"
                  name="dealExpiry"
                  value={formData.dealExpiry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            )}
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Visibility</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-neutral-900 rounded focus:ring-2 focus:ring-neutral-900"
            />
            <span className="text-sm text-neutral-700">
              Product is active and visible to customers
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiSave className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
