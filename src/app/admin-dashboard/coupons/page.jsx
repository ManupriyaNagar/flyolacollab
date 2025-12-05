"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "@/baseUrl/baseUrl";
import { TicketIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    max_discount: "",
    min_booking_amount: "",
    usage_limit: "",
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: "",
    description: "",
    auto_apply: false
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingCoupon 
        ? `${BASE_URL}/coupons/${editingCoupon.id}`
        : `${BASE_URL}/coupons`;
      
      const response = await fetch(url, {
        method: editingCoupon ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingCoupon ? "Coupon updated!" : "Coupon created!");
        setShowModal(false);
        resetForm();
        fetchCoupons();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save coupon");
      }
    } catch (error) {
      toast.error("Error saving coupon");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success("Coupon deleted!");
        fetchCoupons();
      }
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      max_discount: "",
      min_booking_amount: "",
      usage_limit: "",
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: "",
      description: "",
      auto_apply: false
    });
    setEditingCoupon(null);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      max_discount: coupon.max_discount || "",
      min_booking_amount: coupon.min_booking_amount || "",
      usage_limit: coupon.usage_limit || "",
      valid_from: coupon.valid_from?.split('T')[0] || "",
      valid_until: coupon.valid_until?.split('T')[0] || "",
      description: coupon.description || "",
      auto_apply: coupon.auto_apply || false
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8">Loading coupons...</div>;
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TicketIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          </div>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="text-2xl font-bold text-purple-600 mb-1">{coupon.code}</div>
                <div className="text-sm text-gray-500">{coupon.description}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {coupon.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold">
                  {coupon.discount_type === 'percentage' 
                    ? `${coupon.discount_value}%` 
                    : `₹${coupon.discount_value}`}
                </span>
              </div>
              {coupon.max_discount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Max Discount:</span>
                  <span className="font-semibold">₹{coupon.max_discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min Amount:</span>
                <span className="font-semibold">₹{coupon.min_booking_amount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usage:</span>
                <span className="font-semibold">
                  {coupon.used_count} / {coupon.usage_limit || '∞'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valid Until:</span>
                <span className="font-semibold">
                  {new Date(coupon.valid_until).toLocaleDateString()}
                </span>
              </div>
              {coupon.auto_apply && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Auto-Apply
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(coupon)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(coupon.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-12">
          <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No coupons created yet</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="SUMMER2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={formData.discount_type === 'percentage' ? '10' : '100'}
                    required
                  />
                </div>

                {formData.discount_type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Discount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.max_discount}
                      onChange={(e) => setFormData({...formData, max_discount: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Booking Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.min_booking_amount}
                    onChange={(e) => setFormData({...formData, min_booking_amount: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Usage Limit (blank = unlimited)
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                  placeholder="10% off on all bookings"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <input
                  type="checkbox"
                  id="auto_apply"
                  checked={formData.auto_apply}
                  onChange={(e) => setFormData({...formData, auto_apply: e.target.checked})}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="auto_apply" className="flex-1 cursor-pointer">
                  <div className="text-sm font-semibold text-gray-900">Auto-Apply at Checkout</div>
                  <div className="text-xs text-gray-600">
                    Automatically apply this coupon if it provides the best discount for the customer
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  {editingCoupon ? "Update" : "Create"} Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
