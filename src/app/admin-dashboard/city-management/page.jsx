"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaFilter,
  FaGlobe,
  FaImage,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTrash
} from "react-icons/fa";

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    country: "India",
    description: "",
    imageUrl: "",
    status: 0
  });

  // Indian states for dropdown
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const response = await API.hotels.getCities().catch(() => ({ data: [] }));

        if (response.data && Array.isArray(response.data)) {
          setCities(response.data);
        } else {
          // Fallback cities data
          setCities([
            {
              id: 1,
              name: "Mumbai",
              state: "Maharashtra",
              country: "India",
              description: "Financial capital of India with beautiful beaches and bustling city life",
              imageUrl: null,
              status: 0,
              createdAt: "2024-12-13T10:00:00Z"
            },
            {
              id: 2,
              name: "Delhi",
              state: "Delhi",
              country: "India",
              description: "Capital city with rich history and modern amenities",
              imageUrl: null,
              status: 0,
              createdAt: "2024-12-13T10:00:00Z"
            },
            {
              id: 3,
              name: "Bangalore",
              state: "Karnataka",
              country: "India",
              description: "Silicon Valley of India with pleasant weather",
              imageUrl: null,
              status: 0,
              createdAt: "2024-12-13T10:00:00Z"
            },
            {
              id: 4,
              name: "Goa",
              state: "Goa",
              country: "India",
              description: "Beach paradise with Portuguese heritage",
              imageUrl: null,
              status: 0,
              createdAt: "2024-12-13T10:00:00Z"
            },
            {
              id: 5,
              name: "Jaipur",
              state: "Rajasthan",
              country: "India",
              description: "Pink City with royal palaces and forts",
              imageUrl: null,
              status: 0,
              createdAt: "2024-12-13T10:00:00Z"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = selectedState === "" || city.state === selectedState;
    
    return matchesSearch && matchesState;
  });

  const getStatusColor = (status) => {
    return status === 0 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  // Admin Functions
  const handleAddCity = () => {
    setFormData({
      name: "",
      state: "",
      country: "India",
      description: "",
      imageUrl: "",
      status: 0
    });
    setShowAddModal(true);
  };

  const handleEditCity = (city) => {
    setFormData({
      name: city.name,
      state: city.state,
      country: city.country,
      description: city.description || "",
      imageUrl: city.imageUrl || "",
      status: city.status
    });
    setSelectedCity(city);
    setShowEditModal(true);
  };

  const handleDeleteCity = async (cityId) => {
    if (confirm('Are you sure you want to delete this city? This will also delete all associated hotels.')) {
      try {
        try {
          await API.hotels.deleteCity(cityId);
          setCities(prev => prev.filter(c => c.id !== cityId));
          alert('City deleted successfully!');
        } catch (apiError) {
          // Fallback: Delete locally if API fails
          console.warn('API not available, deleting locally:', apiError);
          setCities(prev => prev.filter(c => c.id !== cityId));
          alert('City deleted successfully! (Note: Go backend not running - changes are local only)');
        }
      } catch (error) {
        console.error('Error deleting city:', error);
        alert('Failed to delete city. Please try again.');
      }
    }
  };

  const handleSubmitCity = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (showEditModal && selectedCity) {
        // Update existing city
        try {
          const response = await API.hotels.updateCity(selectedCity.id, formData);
          setCities(prev => prev.map(c => c.id === selectedCity.id ? { ...c, ...formData } : c));
          alert('City updated successfully!');
        } catch (apiError) {
          // Fallback: Update locally if API fails
          console.warn('API not available, updating locally:', apiError);
          setCities(prev => prev.map(c => c.id === selectedCity.id ? { ...c, ...formData } : c));
          alert('City updated successfully! (Note: Go backend not running - changes are local only)');
        }
      } else {
        // Create new city
        try {
          const response = await API.hotels.createCity(formData);
          const newCity = { id: Date.now(), ...formData, createdAt: new Date().toISOString() };
          setCities(prev => [...prev, newCity]);
          alert('City created successfully!');
        } catch (apiError) {
          // Fallback: Create locally if API fails
          console.warn('API not available, creating locally:', apiError);
          const newCity = { id: Date.now(), ...formData, createdAt: new Date().toISOString() };
          setCities(prev => [...prev, newCity]);
          alert('City created successfully! (Note: Go backend not running - changes are local only)');
        }
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedCity(null);
    } catch (error) {
      console.error('Error saving city:', error);
      alert('Failed to save city. Please try again.');
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
                  <FaMapMarkerAlt className="text-blue-600" />
                  City Management
                </h1>
                <p className={cn('text-gray-600', 'mt-1')}>Manage cities and destinations for hotel bookings</p>
              </div>
              <button className={cn('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2', 'font-medium')}>
                <FaPlus />
                Add New City
              </button>
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6', 'mb-6')}>
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4')}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={cn('h-10', 'bg-gray-200', 'rounded-lg', 'animate-pulse')}></div>
              ))}
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6', 'mb-8')}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
                <div className={cn('flex', 'items-center', 'justify-between')}>
                  <div className="flex-1">
                    <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse', 'mb-2')}></div>
                    <div className={cn('h-8', 'bg-gray-200', 'rounded', 'animate-pulse', 'w-16')}></div>
                  </div>
                  <div className={cn('bg-gray-200', 'p-3', 'rounded-full', 'animate-pulse')}>
                    <div className={cn('w-6', 'h-6')}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cities Grid Skeleton */}
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
                <FaMapMarkerAlt className="text-blue-600" />
                City Management
              </h1>
              <p className={cn('text-gray-600', 'mt-1')}>Manage cities and destinations for hotel bookings</p>
            </div>
            <button 
              onClick={handleAddCity}
              className={cn('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2', 'font-medium')}
            >
              <FaPlus />
              Add New City
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
                placeholder="Search cities..."
                className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">All States</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
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
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Cities</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>{cities.length}</p>
              </div>
              <div className={cn('bg-blue-100', 'p-3', 'rounded-full')}>
                <FaMapMarkerAlt className={cn('text-blue-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Active Cities</p>
                <p className={cn('text-3xl', 'font-bold', 'text-green-600')}>
                  {cities.filter(c => c.status === 0).length}
                </p>
              </div>
              <div className={cn('bg-green-100', 'p-3', 'rounded-full')}>
                <FaMapMarkerAlt className={cn('text-green-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>States Covered</p>
                <p className={cn('text-3xl', 'font-bold', 'text-purple-600')}>
                  {new Set(cities.map(c => c.state)).size}
                </p>
              </div>
              <div className={cn('bg-purple-100', 'p-3', 'rounded-full')}>
                <FaGlobe className={cn('text-purple-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>With Images</p>
                <p className={cn('text-3xl', 'font-bold', 'text-orange-600')}>
                  {cities.filter(c => c.imageUrl).length}
                </p>
              </div>
              <div className={cn('bg-orange-100', 'p-3', 'rounded-full')}>
                <FaImage className={cn('text-orange-600', 'text-xl')} />
              </div>
            </div>
          </div>
        </div>

        {/* Cities Grid */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
          {filteredCities.map((city) => (
            <motion.div
              key={city.id}
              className={cn('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'overflow-hidden', 'hover:shadow-lg', 'transition-all', 'duration-300')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                <div className={cn('h-48', 'bg-gradient-to-r', 'from-blue-400', 'to-purple-600', 'flex', 'items-center', 'justify-center')}>
                  {city.imageUrl ? (
                    <img src={city.imageUrl} alt={city.name} className={cn('w-full', 'h-full', 'object-cover')} />
                  ) : (
                    <FaMapMarkerAlt className={cn('text-white', 'text-6xl', 'opacity-50')} />
                  )}
                </div>
                <div className={cn('absolute', 'top-4', 'right-4')}>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(city.status)}`}>
                    {city.status === 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className={cn('flex', 'items-start', 'justify-between', 'mb-3')}>
                  <div>
                    <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-1')}>{city.name}</h3>
                    <p className={cn('text-sm', 'text-gray-600')}>{city.state}, {city.country}</p>
                  </div>
                </div>

                <p className={cn('text-gray-600', 'text-sm', 'mb-4', 'line-clamp-3')}>{city.description}</p>

                <div className={cn('text-xs', 'text-gray-500', 'mb-4')}>
                  Added: {new Date(city.createdAt).toLocaleDateString()}
                </div>

                <div className={cn('flex', 'gap-2')}>
                  <button 
                    onClick={() => setSelectedCity(city)}
                    className={cn('flex-1', 'bg-blue-600', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'justify-center', 'gap-2', 'text-sm')}
                  >
                    <FaEye size={14} />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleEditCity(city)}
                    className={cn('bg-yellow-500', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-yellow-600', 'transition-colors')}
                  >
                    <FaEdit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCity(city.id)}
                    className={cn('bg-red-500', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-red-600', 'transition-colors')}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className={cn('text-center', 'py-12')}>
            <FaMapMarkerAlt className={cn('mx-auto', 'text-gray-400', 'text-6xl', 'mb-4')} />
            <h3 className={cn('text-xl', 'font-medium', 'text-gray-900', 'mb-2')}>No cities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new city.</p>
          </div>
        )}
      </div>

      {/* Add/Edit City Modal */}
      {(showAddModal || showEditModal) && (
        <div className={cn('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-2xl', 'w-full', 'max-h-[90vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
                  {showEditModal ? 'Edit City' : 'Add New City'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedCity(null);
                  }}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitCity} className={cn('p-6', 'space-y-4')}>
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>City Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="Enter city name"
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="Country"
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

                <div className="md:col-span-2">
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="https://example.com/city-image.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="Enter city description"
                  />
                </div>
              </div>

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedCity(null);
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
                    showEditModal ? 'Update City' : 'Create City'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* City Details Modal */}
      {selectedCity && !showEditModal && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-2xl', 'w-full', 'max-h-[80vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>City Details</h3>
                <button
                  onClick={() => setSelectedCity(null)}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className={cn('p-6', 'space-y-4')}>
              {selectedCity.imageUrl && (
                <div className="mb-4">
                  <img src={selectedCity.imageUrl} alt={selectedCity.name} className={cn('w-full', 'h-48', 'object-cover', 'rounded-lg')} />
                </div>
              )}

              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>City Name</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedCity.name}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>State</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedCity.state}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Country</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedCity.country}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedCity.status)}`}>
                    {selectedCity.status === 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Description</label>
                <p className={cn('text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg')}>{selectedCity.description}</p>
              </div>

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                <button
                  onClick={() => handleEditCity(selectedCity)}
                  className={cn('px-4', 'py-2', 'bg-yellow-500', 'text-white', 'rounded-lg', 'hover:bg-yellow-600', 'transition-colors', 'flex', 'items-center', 'gap-2')}
                >
                  <FaEdit />
                  Edit City
                </button>
                <button
                  onClick={() => setSelectedCity(null)}
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

export default CityManagement;