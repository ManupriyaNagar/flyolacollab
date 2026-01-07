"use client";

import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCoffee,
  FaEdit,
  FaEye,
  FaHamburger,
  FaPizzaSlice,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUtensils
} from "react-icons/fa";
import { toast } from "react-toastify";

const MealPlans = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    includesBreakfast: false,
    includesLunch: false,
    includesDinner: false,
    status: 0
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.hotels.getMealPlans();
      if (response && response.data) {
        // Map database fields to camelCase
        const mappedData = response.data.map(plan => ({
          ...plan,
          includesBreakfast: plan.includes_breakfast ?? plan.includesBreakfast ?? false,
          includesLunch: plan.includes_lunch ?? plan.includesLunch ?? false,
          includesDinner: plan.includes_dinner ?? plan.includesDinner ?? false
        }));
        setMealPlans(mappedData);
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      toast.error('Failed to fetch meal plans');
      setMealPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.hotels.createMealPlan(formData);
      toast.success('Meal plan created successfully!');
      setShowAddModal(false);
      setFormData({
        code: '',
        name: '',
        description: '',
        includesBreakfast: false,
        includesLunch: false,
        includesDinner: false,
        status: 0
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error creating meal plan:', error);
      toast.error('Failed to create meal plan');
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      code: plan.code || '',
      name: plan.name || '',
      description: plan.description || '',
      includesBreakfast: plan.includes_breakfast || plan.includesBreakfast || false,
      includesLunch: plan.includes_lunch || plan.includesLunch || false,
      includesDinner: plan.includes_dinner || plan.includesDinner || false,
      status: plan.status !== undefined ? plan.status : 0
    });
    setSelectedMealPlan(plan);
    setShowAddModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.hotels.updateMealPlan(selectedMealPlan.id, formData);
      toast.success('Meal plan updated successfully!');
      setShowAddModal(false);
      setSelectedMealPlan(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        includesBreakfast: false,
        includesLunch: false,
        includesDinner: false,
        status: 0
      });
      fetchData();
    } catch (error) {
      console.error('Error updating meal plan:', error);
      toast.error('Failed to update meal plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await API.hotels.deleteMealPlan(id);
        toast.success('Meal plan deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting meal plan:', error);
        toast.error('Failed to delete meal plan');
      }
    }
  };

  const filteredMealPlans = mealPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getMealIcon = (includes) => {
    if (includes) {
      return <FaUtensils className="text-green-500" />;
    }
    return <span className="text-gray-300">—</span>;
  };

  const getPlanIcon = (code) => {
    switch (code) {
      case 'EP': return <FaCoffee className="text-brown-500" />;
      case 'CP': return <FaCoffee className="text-orange-500" />;
      case 'MAP': return <FaHamburger className="text-blue-500" />;
      case 'AP': return <FaPizzaSlice className="text-purple-500" />;
      default: return <FaUtensils className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    return status === 0 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
          <div className="bg-gray-200 p-3 rounded-full animate-pulse">
            <div className="w-6 h-6"></div>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center p-2 bg-gray-100 rounded-lg">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FaUtensils className="text-orange-600" />
                  Meal Plans
                </h1>
                <p className="text-gray-600 mt-1">Manage hotel meal plan options and pricing</p>
              </div>
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium">
                <FaPlus />
                Add Meal Plan
              </button>
            </div>
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-1/3"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                  <div className="bg-gray-200 p-3 rounded-full animate-pulse">
                    <div className="w-6 h-6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Meal Plans Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FaUtensils className="text-orange-600" />
                Meal Plans
              </h1>
              <p className="text-gray-600 mt-1">Manage hotel meal plan options and pricing</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
            >
              <FaPlus />
              Add Meal Plan
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search meal plans..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-3xl font-bold text-gray-900">{mealPlans.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaUtensils className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-3xl font-bold text-green-600">
                  {mealPlans.filter(p => p.status === 0).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaUtensils className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full Board</p>
                <p className="text-3xl font-bold text-purple-600">
                  {mealPlans.filter(p => p.includesBreakfast && p.includesLunch && p.includesDinner).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaPizzaSlice className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Room Only</p>
                <p className="text-3xl font-bold text-blue-600">
                  {mealPlans.filter(p => !p.includesBreakfast && !p.includesLunch && !p.includesDinner).length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaCoffee className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Meal Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMealPlans.map((plan) => (
            <motion.div
              key={plan.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full">
                      {getPlanIcon(plan.code)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                        {plan.code}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(plan.status)}`}>
                    {plan.status === 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{plan.description}</p>

                {/* Meal Inclusions */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getMealIcon(plan.includesBreakfast)}
                    </div>
                    <div className="text-xs font-medium text-gray-700">Breakfast</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getMealIcon(plan.includesLunch)}
                    </div>
                    <div className="text-xs font-medium text-gray-700">Lunch</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getMealIcon(plan.includesDinner)}
                    </div>
                    <div className="text-xs font-medium text-gray-700">Dinner</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedMealPlan(plan)}
                    className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaEye size={14} />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleEdit(plan)}
                    className="bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(plan.id)}
                    className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMealPlans.length === 0 && (
          <div className="text-center py-12">
            <FaUtensils className="mx-auto text-gray-400 text-6xl mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No meal plans found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new meal plan.</p>
          </div>
        )}
      </div>

      {/* Meal Plan Details Modal */}
      {selectedMealPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Meal Plan Details</h3>
                <button
                  onClick={() => setSelectedMealPlan(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  {getPlanIcon(selectedMealPlan.code)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedMealPlan.name}</h4>
                  <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-blue-100 text-blue-800">
                    {selectedMealPlan.code}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedMealPlan.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Meal Inclusions</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getMealIcon(selectedMealPlan.includesBreakfast)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Breakfast</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedMealPlan.includesBreakfast ? 'Included' : 'Not Included'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getMealIcon(selectedMealPlan.includesLunch)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Lunch</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedMealPlan.includesLunch ? 'Included' : 'Not Included'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getMealIcon(selectedMealPlan.includesDinner)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Dinner</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedMealPlan.includesDinner ? 'Included' : 'Not Included'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600">Status: </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedMealPlan.status)}`}>
                    {selectedMealPlan.status === 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <FaEdit />
                  Edit Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Meal Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">{selectedMealPlan && selectedMealPlan.id ? 'Edit Meal Plan' : 'Add New Meal Plan'}</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedMealPlan(null);
                    setFormData({
                      code: '',
                      name: '',
                      description: '',
                      includesBreakfast: false,
                      includesLunch: false,
                      includesDinner: false,
                      status: 0
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={selectedMealPlan && selectedMealPlan.id ? handleUpdate : handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., EP, CP, MAP"
                    required
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., European Plan"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe what's included in this meal plan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Meal Inclusions
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.includesBreakfast}
                      onChange={(e) => setFormData({...formData, includesBreakfast: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium">Breakfast</span>
                  </label>

                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.includesLunch}
                      onChange={(e) => setFormData({...formData, includesLunch: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium">Lunch</span>
                  </label>

                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.includesDinner}
                      onChange={(e) => setFormData({...formData, includesDinner: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium">Dinner</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value={0}>Active</option>
                  <option value={1}>Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  {selectedMealPlan && selectedMealPlan.id ? 'Update Meal Plan' : 'Create Meal Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlans;