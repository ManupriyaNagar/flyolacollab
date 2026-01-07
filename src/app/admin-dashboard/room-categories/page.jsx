"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaBed,
  FaEdit,
  FaEye,
  FaFilter,
  FaImage,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUsers
} from "react-icons/fa";
import { toast } from "react-toastify";

const RoomCategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(""); // For filtering
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hotelId: "", // Optional: null for global categories
    name: "",
    description: "",
    maxOccupancy: 2,
    bedType: "",
    roomSize: "",
    amenities: [],
    imageUrl: "",
    status: 0
  });

  const bedTypes = ["Single", "Double", "Queen", "King", "Twin", "Sofa Bed"];
  const commonAmenities = [
    "Air Conditioning", "WiFi", "TV", "Mini Bar", "Safe", "Balcony", 
    "City View", "Sea View", "Mountain View", "Bathtub", "Shower", 
    "Hair Dryer", "Coffee Maker", "Room Service", "Laundry Service"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both categories and hotels
        const [categoriesRes, hotelsRes] = await Promise.all([
          API.hotels.getRoomCategories(),
          API.hotels.getHotels()
        ]);

        if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        } else {
          setCategories([]);
        }

        if (hotelsRes.data && Array.isArray(hotelsRes.data)) {
          setHotels(hotelsRes.data);
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
        setCategories([]);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.bedType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by hotel (empty = all, "global" = no hotel, specific id = that hotel)
    const matchesHotel = selectedHotel === "" || 
                        (selectedHotel === "global" && !category.hotelId) ||
                        (category.hotelId && category.hotelId.toString() === selectedHotel);
    
    return matchesSearch && matchesHotel;
  });

  const getStatusColor = (status) => {
    return status === 0 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  // Admin Functions
  const handleAddCategory = () => {
    setFormData({
      hotelId: "",
      name: "",
      description: "",
      maxOccupancy: 2,
      bedType: "",
      roomSize: "",
      amenities: [],
      imageUrl: "",
      status: 0
    });
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setFormData({
      hotelId: category.hotelId || category.hotel_id || "",
      name: category.name || "",
      description: category.description || "",
      maxOccupancy: category.maxOccupancy || category.max_occupancy || 2,
      bedType: category.bedType || category.bed_type || "",
      roomSize: category.roomSize || category.room_size || "",
      amenities: Array.isArray(category.amenities) ? category.amenities : [],
      imageUrl: category.imageUrl || category.image_url || "",
      status: category.status !== undefined ? category.status : 0
    });
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this room category? This will affect all rooms using this category.')) {
      try {
        await API.hotels.deleteRoomCategory(categoryId);
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        toast.success('Room category deleted successfully!');
      } catch (error) {
        console.error('Error deleting room category:', error);
        toast.error('Failed to delete room category. Please try again.');
      }
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare data for API - convert hotelId to number or null
      const apiData = {
        ...formData,
        hotelId: formData.hotelId ? parseInt(formData.hotelId) : null,
        maxOccupancy: parseInt(formData.maxOccupancy) || 2,
        status: parseInt(formData.status) || 0
      };

      if (showEditModal && selectedCategory) {
        // Update existing category
        const response = await API.hotels.updateRoomCategory(selectedCategory.id, apiData);
        setCategories(prev => prev.map(c => c.id === selectedCategory.id ? { ...c, ...apiData, id: selectedCategory.id } : c));
        toast.success('Room category updated successfully!');
      } else {
        // Create new category
        const response = await API.hotels.createRoomCategory(apiData);
        const newCategory = response.data || { id: Date.now(), ...apiData, createdAt: new Date().toISOString() };
        setCategories(prev => [...prev, newCategory]);
        toast.success('Room category created successfully!');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving room category:', error);
      console.error('Error details:', error.data || error.message);
      toast.error(error.data?.error || error.message || 'Failed to save room category. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const SkeletonCard = () => (
    <div className={cn('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'overflow-hidden')}>
      <div className={cn('h-48', 'bg-gray-200', 'animate-pulse')}></div>
      <div className="p-6">
        <div className={cn('h-6', 'bg-gray-200', 'rounded', 'animate-pulse', 'mb-2')}></div>
        <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse', 'w-3/4', 'mb-4')}></div>
        <div className={cn('space-y-2', 'mb-4')}>
          <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
          <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse', 'w-1/2')}></div>
        </div>
        <div className={cn('flex', 'gap-2')}>
          <div className={cn('flex-1', 'h-10', 'bg-gray-200', 'rounded-lg', 'animate-pulse')}></div>
          <div className={cn('h-10', 'w-10', 'bg-gray-200', 'rounded-lg', 'animate-pulse')}></div>
          <div className={cn('h-10', 'w-10', 'bg-gray-200', 'rounded-lg', 'animate-pulse')}></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50')}>
        {/* Header */}
        <div className={cn('bg-white', 'shadow-sm', 'border-b')}>
          <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
                  <FaBed className="text-blue-600" />
                  Room Categories Management
                </h1>
                <p className={cn('text-gray-600', 'mt-1')}>Manage room types and categories for hotels</p>
              </div>
              <button className={cn('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2', 'font-medium')}>
                <FaPlus />
                Add New Category
              </button>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>
      {/* Header */}
      <div className={cn('bg-white', 'shadow-sm', 'border-b')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
                <FaBed className="text-blue-600" />
                Room Categories Management
              </h1>
              <p className={cn('text-gray-600', 'mt-1')}>Manage room types and categories for hotels</p>
            </div>
            <button 
              onClick={handleAddCategory}
              className={cn('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2', 'font-medium')}
            >
              <FaPlus />
              Add New Category
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
        <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6', 'mb-6')}>
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4')}>
            <div className="relative">
              <FaSearch className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
              <input
                type="text"
                placeholder="Search categories..."
                className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
            >
              <option value="">All Bed Types</option>
              {bedTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button className={cn('bg-gray-100', 'text-gray-700', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-gray-200', 'transition-colors', 'flex', 'items-center', 'justify-center', 'gap-2')}>
              <FaFilter />
              More Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6', 'mb-8')}>
          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Categories</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>{categories.length}</p>
              </div>
              <div className={cn('bg-blue-100', 'p-3', 'rounded-full')}>
                <FaBed className={cn('text-blue-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Active Categories</p>
                <p className={cn('text-3xl', 'font-bold', 'text-green-600')}>
                  {categories.filter(c => c.status === 0).length}
                </p>
              </div>
              <div className={cn('bg-green-100', 'p-3', 'rounded-full')}>
                <FaBed className={cn('text-green-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Avg Occupancy</p>
                <p className={cn('text-3xl', 'font-bold', 'text-purple-600')}>
                  {categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + c.maxOccupancy, 0) / categories.length) : 0}
                </p>
              </div>
              <div className={cn('bg-purple-100', 'p-3', 'rounded-full')}>
                <FaUsers className={cn('text-purple-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>With Images</p>
                <p className={cn('text-3xl', 'font-bold', 'text-orange-600')}>
                  {categories.filter(c => c.imageUrl).length}
                </p>
              </div>
              <div className={cn('bg-orange-100', 'p-3', 'rounded-full')}>
                <FaImage className={cn('text-orange-600', 'text-xl')} />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              className={cn('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'overflow-hidden', 'hover:shadow-lg', 'transition-all', 'duration-300')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                <div className={cn('h-48', 'bg-gradient-to-r', 'from-blue-400', 'to-purple-600', 'flex', 'items-center', 'justify-center')}>
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className={cn('w-full', 'h-full', 'object-cover')} />
                  ) : (
                    <FaBed className={cn('text-white', 'text-6xl', 'opacity-50')} />
                  )}
                </div>
                <div className={cn('absolute', 'top-4', 'right-4')}>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(category.status)}`}>
                    {category.status === 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className={cn('flex', 'items-start', 'justify-between', 'mb-3')}>
                  <div>
                    <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-1')}>{category.name}</h3>
                    <p className={cn('text-sm', 'text-gray-600')}>{category.bedType} • Max {category.maxOccupancy} guests</p>
                  </div>
                </div>

                <p className={cn('text-gray-600', 'text-sm', 'mb-4', 'line-clamp-3')}>{category.description}</p>

                <div className={cn('grid', 'grid-cols-2', 'gap-4', 'mb-4', 'text-sm')}>
                  <div>
                    <span className={cn('text-gray-500')}>Room Size:</span>
                    <p className={cn('font-medium')}>{category.roomSize || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className={cn('text-gray-500')}>Amenities:</span>
                    <p className={cn('font-medium')}>{category.amenities?.length || 0} items</p>
                  </div>
                </div>

                <div className={cn('flex', 'gap-2')}>
                  <button 
                    onClick={() => setSelectedCategory(category)}
                    className={cn('flex-1', 'bg-blue-600', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'justify-center', 'gap-2', 'text-sm')}
                  >
                    <FaEye size={14} />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className={cn('bg-yellow-500', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-yellow-600', 'transition-colors')}
                  >
                    <FaEdit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className={cn('bg-red-500', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-red-600', 'transition-colors')}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className={cn('text-center', 'py-12')}>
            <FaBed className={cn('mx-auto', 'text-gray-400', 'text-6xl', 'mb-4')} />
            <h3 className={cn('text-xl', 'font-medium', 'text-gray-900', 'mb-2')}>No room categories found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new category.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {(showAddModal || showEditModal) && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-4xl', 'w-full', 'max-h-[90vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
                  {showEditModal ? 'Edit Room Category' : 'Add New Room Category'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedCategory(null);
                  }}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitCategory} className={cn('p-6', 'space-y-6')}>
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="e.g., Deluxe Double"
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Bed Type</label>
                  <select
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleInputChange}
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                  >
                    <option value="">Select Bed Type</option>
                    {bedTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Max Occupancy</label>
                  <input
                    type="number"
                    name="maxOccupancy"
                    value={formData.maxOccupancy}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Room Size</label>
                  <input
                    type="text"
                    name="roomSize"
                    value={formData.roomSize}
                    onChange={handleInputChange}
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="e.g., 25 sqm"
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                  >
                    <option value={0}>Active</option>
                    <option value={1}>Inactive</option>
                  </select>
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="https://example.com/room-image.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="Describe the room category features and amenities"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-3')}>Amenities</label>
                  <div className={cn('grid', 'grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-2')}>
                    {commonAmenities.map(amenity => (
                      <label key={amenity} className={cn('flex', 'items-center', 'space-x-2', 'cursor-pointer')}>
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className={cn('rounded', 'border-gray-300', 'text-blue-600', 'focus:ring-blue-500')}
                        />
                        <span className={cn('text-sm', 'text-gray-700')}>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedCategory(null);
                  }}
                  className={cn('px-4', 'py-2', 'text-gray-700', 'bg-gray-200', 'rounded-lg', 'hover:bg-gray-300', 'transition-colors')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn('px-6', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'flex', 'items-center', 'gap-2')}
                >
                  {submitting ? (
                    <>
                      <div className={cn('animate-spin', 'rounded-full', 'h-4', 'w-4', 'border-b-2', 'border-white')}></div>
                      {showEditModal ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    showEditModal ? 'Update Category' : 'Create Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Details Modal */}
      {selectedCategory && !showEditModal && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-2xl', 'w-full', 'max-h-[80vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Room Category Details</h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className={cn('p-6', 'space-y-4')}>
              {selectedCategory.imageUrl && (
                <div className="mb-4">
                  <img src={selectedCategory.imageUrl} alt={selectedCategory.name} className={cn('w-full', 'h-48', 'object-cover', 'rounded-lg')} />
                </div>
              )}

              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Category Name</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedCategory.name}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Bed Type</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedCategory.bedType}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Max Occupancy</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedCategory.maxOccupancy} guests</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Room Size</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedCategory.roomSize || 'Not specified'}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedCategory.status)}`}>
                    {selectedCategory.status === 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Description</label>
                <p className={cn('text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg')}>{selectedCategory.description}</p>
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Amenities</label>
                <div className={cn('flex', 'flex-wrap', 'gap-2')}>
                  {selectedCategory.amenities?.map(amenity => (
                    <span key={amenity} className={cn('px-2', 'py-1', 'bg-blue-100', 'text-blue-800', 'text-xs', 'rounded-full')}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                <button
                  onClick={() => handleEditCategory(selectedCategory)}
                  className={cn('px-4', 'py-2', 'bg-yellow-500', 'text-white', 'rounded-lg', 'hover:bg-yellow-600', 'transition-colors', 'flex', 'items-center', 'gap-2')}
                >
                  <FaEdit />
                  Edit Category
                </button>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn('px-4', 'py-2', 'bg-gray-500', 'text-white', 'rounded-lg', 'hover:bg-gray-600', 'transition-colors')}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCategoriesManagement;