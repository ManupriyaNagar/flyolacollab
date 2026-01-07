"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaCoffee,
    FaEdit,
    FaEnvelope,
    FaHamburger,
    FaHotel,
    FaImage,
    FaPhone,
    FaPizzaSlice,
    FaSave,
    FaStar
} from "react-icons/fa";
import { toast } from "react-toastify";

import HotelImageUpload from "../../../../../components/admin/HotelImageUpload";

const EditHotelClient = ({ id }) => {
  const router = useRouter();
  const [mealPlans, setMealPlans] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cityId: "",
    address: "",
    starRating: 3,
    contactPhone: "",
    contactEmail: "",
    description: "",
    amenities: [],
    images: [],
    mealPlanIds: [], 
    status: "Active"
  });

  // Hotel amenities options
  const hotelAmenities = [
    { id: "swimming_pool", label: "Swimming Pool", icon: "🏊‍♂️", category: "Recreation" },
    { id: "fitness_center", label: "Fitness Center", icon: "💪", category: "Recreation" },
    { id: "spa", label: "Spa & Wellness", icon: "🧘‍♀️", category: "Recreation" },
    { id: "restaurant", label: "Restaurant", icon: "🍽️", category: "Dining" },
    { id: "bar", label: "Bar/Lounge", icon: "🍸", category: "Dining" },
    { id: "room_service", label: "24/7 Room Service", icon: "🛎️", category: "Service" },
    { id: "concierge", label: "Concierge Service", icon: "👨‍💼", category: "Service" },
    { id: "business_center", label: "Business Center", icon: "💼", category: "Business" },
    { id: "meeting_rooms", label: "Meeting Rooms", icon: "🏢", category: "Business" },
    { id: "conference_hall", label: "Conference Hall", icon: "🎤", category: "Business" },
    { id: "free_wifi", label: "Free WiFi", icon: "📶", category: "Technology" },
    { id: "parking", label: "Free Parking", icon: "🚗", category: "Transportation" },
    { id: "airport_shuttle", label: "Airport Shuttle", icon: "🚐", category: "Transportation" },
    { id: "laundry", label: "Laundry Service", icon: "👕", category: "Service" },
    { id: "pet_friendly", label: "Pet Friendly", icon: "🐕", category: "Policy" },
    { id: "kids_club", label: "Kids Club", icon: "🎈", category: "Family" },
    { id: "playground", label: "Playground", icon: "🎪", category: "Family" },
    { id: "garden", label: "Garden/Terrace", icon: "🌿", category: "Outdoor" },
    { id: "balcony_view", label: "Scenic Views", icon: "🌅", category: "Outdoor" },
    { id: "elevator", label: "Elevator Access", icon: "🛗", category: "Accessibility" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [hotelRes, citiesRes, mealPlansRes] = await Promise.all([
          API.hotels.getHotelById(id).catch(() => null),
          API.hotels.getCities().catch(() => ({ data: [] })),
          API.hotels.getMealPlans().catch(() => ({ data: [] }))
        ]);

        // Set hotel data
        if (hotelRes && hotelRes.data) {
          const hotelData = hotelRes.data;
          setHotel(hotelData);
          setFormData({
            name: hotelData.name || "",
            cityId: hotelData.cityId || "",
            address: hotelData.address || "",
            starRating: hotelData.starRating || 3,
            contactPhone: hotelData.contactPhone || "",
            contactEmail: hotelData.contactEmail || "",
            description: hotelData.description || "",
            amenities: hotelData.amenities || [],
            images: hotelData.images || [],
            mealPlanIds: hotelData.mealPlanIds || [],
            status: hotelData.status || "Active"
          });
        } else {
          toast.error('Hotel not found');
          router.push('/admin-dashboard/hotel-management');
          return;
        }

        if (citiesRes.data && Array.isArray(citiesRes.data)) {
          setCities(citiesRes.data);
        } else {
          setCities([]);
        }

        if (mealPlansRes.data && Array.isArray(mealPlansRes.data)) {
          setMealPlans(mealPlansRes.data);
        } else {
          setMealPlans([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch hotel data');
        router.push('/admin-dashboard/hotel-management');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, router]);

  const handleMealPlanToggle = (mealPlanId) => {
    setFormData(prev => ({
      ...prev,
      mealPlanIds: prev.mealPlanIds.includes(mealPlanId)
        ? prev.mealPlanIds.filter(id => id !== mealPlanId)
        : [...prev.mealPlanIds, mealPlanId]
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleSubmitHotel = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await API.hotels.updateHotel(id, formData);
      toast.success('Hotel updated successfully!');
      router.push('/admin-dashboard/hotel-management');
    } catch (error) {
      console.error('Error updating hotel:', error);
      toast.error('Failed to update hotel. Please try again.');
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

  if (loading) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600">Loading hotel data...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <FaHotel className="text-gray-400 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600 mb-4">The hotel you're looking for doesn't exist.</p>
          <Link 
            href="/admin-dashboard/hotel-management"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Hotel Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>
      {/* Header */}
      <div className={cn('bg-white', 'shadow-sm', 'border-b')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('flex', 'items-center', 'gap-4')}>
            <Link 
              href="/admin-dashboard/hotel-management"
              className={cn('p-2', 'text-gray-600', 'hover:text-gray-900', 'hover:bg-gray-100', 'rounded-lg', 'transition-colors')}
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
                <div className={cn('p-2', 'bg-yellow-100', 'rounded-lg')}>
                  <FaEdit className="text-yellow-600 text-xl" />
                </div>
                Edit Hotel: {hotel.name}
              </h1>
              <p className={cn('text-gray-600', 'mt-1')}>Update hotel information and settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className={cn('max-w-5xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8')}>
        <form onSubmit={handleSubmitHotel} className={cn('space-y-8')}>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-yellow-600 font-medium">
                <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                Basic Info
              </span>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <span className="flex items-center gap-2 text-gray-400">
                <div className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs">2</div>
                Contact
              </span>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <span className="flex items-center gap-2 text-gray-400">
                <div className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs">3</div>
                Amenities
              </span>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <span className="flex items-center gap-2 text-gray-400">
                <div className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs">4</div>
                Media
              </span>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg border">
            <h4 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-6', 'pb-3', 'border-b', 'border-gray-200', 'flex', 'items-center', 'gap-3')}>
              <div className={cn('p-2', 'bg-blue-100', 'rounded-lg')}>
                <FaHotel className="text-blue-600" />
              </div>
              Basic Information
            </h4>
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
              <div>
                <label className={cn('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2')}>
                  Hotel Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'bg-white', 'shadow-sm')}
                  placeholder="e.g., The Grand Mumbai"
                />
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2')}>
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleInputChange}
                  required
                  className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'bg-white', 'shadow-sm')}
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={cn('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2')}>
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'resize-none', 'bg-white', 'shadow-sm')}
                  placeholder="Enter complete hotel address"
                />
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2')}>
                  Star Rating <span className="text-red-500">*</span>
                </label>
                <select
                  name="starRating"
                  value={formData.starRating}
                  onChange={handleInputChange}
                  required
                  className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'bg-white', 'shadow-sm')}
                >
                  <option value={1}>⭐ 1 Star</option>
                  <option value={2}>⭐⭐ 2 Stars</option>
                  <option value={3}>⭐⭐⭐ 3 Stars</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                </select>
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2')}>
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'bg-white', 'shadow-sm')}
                >
                  <option value="Active">✓ Active</option>
                  <option value="Inactive">✕ Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg border">
            <h4 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-6', 'pb-3', 'border-b', 'border-gray-200', 'flex', 'items-center', 'gap-3')}>
              <div className={cn('p-2', 'bg-green-100', 'rounded-lg')}>
                <FaPhone className="text-green-600" />
              </div>
              Contact Information
            </h4>
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
              <div>
                <label className={cn('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2')}>
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className={cn('absolute', 'left-4', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400', 'text-sm')} />
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    className={cn('w-full', 'pl-12', 'pr-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'bg-white', 'shadow-sm')}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2')}>
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className={cn('absolute', 'left-4', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400', 'text-sm')} />
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className={cn('w-full', 'pl-12', 'pr-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'bg-white', 'shadow-sm')}
                    placeholder="hotel@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Amenities Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 shadow-lg">
            <h4 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-6', 'pb-3', 'border-b', 'border-blue-200', 'flex', 'items-center', 'gap-3')}>
              <div className={cn('p-2', 'bg-yellow-100', 'rounded-lg')}>
                <FaStar className="text-yellow-600" />
              </div>
              Hotel Amenities & Facilities
            </h4>
            
            {/* Group amenities by category */}
            {['Recreation', 'Dining', 'Service', 'Business', 'Technology', 'Transportation', 'Family', 'Outdoor', 'Accessibility', 'Policy'].map(category => {
              const categoryAmenities = hotelAmenities.filter(amenity => amenity.category === category);
              if (categoryAmenities.length === 0) return null;
              
              return (
                <div key={category} className="mb-6">
                  <h5 className={cn('text-base', 'font-bold', 'text-gray-700', 'mb-4', 'flex', 'items-center', 'gap-2')}>
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                    {category}
                  </h5>
                  <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-3')}>
                    {categoryAmenities.map(amenity => (
                      <label 
                        key={amenity.id} 
                        className={cn(
                          'flex', 'items-center', 'gap-3', 'p-4', 'border-2', 'rounded-xl', 
                          'cursor-pointer', 'hover:shadow-md', 'transition-all', 'duration-200', 'group',
                          formData.amenities.includes(amenity.id) 
                            ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.id)}
                          onChange={() => handleAmenityToggle(amenity.id)}
                          className={cn('w-5', 'h-5', 'rounded', 'border-gray-300', 'text-blue-600', 'focus:ring-blue-500', 'focus:ring-2')}
                        />
                        <span className="text-xl group-hover:scale-110 transition-transform">{amenity.icon}</span>
                        <span className={cn('text-sm', 'font-medium', 'text-gray-900', 'flex-1', 'group-hover:text-blue-700')}>
                          {amenity.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6 p-4 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-800 font-bold flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  Selected Amenities: {formData.amenities.length}
                </p>
                {formData.amenities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, amenities: [] }))}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <p className="text-xs text-blue-600">
                Choose amenities that are available throughout the hotel property. These will be displayed to guests during booking.
              </p>
            </div>
          </div>

          {/* Meal Plans Section */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border border-orange-100 shadow-lg">
            <h4 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-6', 'pb-3', 'border-b', 'border-orange-200', 'flex', 'items-center', 'gap-3')}>
              <div className={cn('p-2', 'bg-orange-100', 'rounded-lg')}>
                <FaCoffee className="text-orange-600" />
              </div>
              Available Meal Plans
            </h4>
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
              {mealPlans.map(plan => (
                <label 
                  key={plan.id} 
                  className={cn(
                    'flex', 'items-start', 'gap-4', 'p-5', 'border-2', 'rounded-xl', 
                    'cursor-pointer', 'hover:shadow-lg', 'transition-all', 'duration-200', 'group',
                    formData.mealPlanIds.includes(plan.id) 
                      ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-200' 
                      : 'border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={formData.mealPlanIds.includes(plan.id)}
                    onChange={() => handleMealPlanToggle(plan.id)}
                    className={cn('mt-1', 'w-5', 'h-5', 'rounded', 'border-gray-300', 'text-orange-600', 'focus:ring-orange-500', 'focus:ring-2')}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn('text-base', 'font-bold', 'text-gray-900', 'group-hover:text-orange-700')}>{plan.name}</span>
                      <span className={cn('text-xs', 'font-bold', 'text-white', 'px-3', 'py-1', 'bg-gradient-to-r', 'from-orange-500', 'to-red-500', 'rounded-full', 'shadow-sm')}>
                        {plan.code}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {plan.includesBreakfast && (
                        <div className="flex items-center gap-2 text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200">
                          <FaCoffee />
                          <span>Breakfast</span>
                        </div>
                      )}
                      {plan.includesLunch && (
                        <div className="flex items-center gap-2 text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-lg border border-red-200">
                          <FaHamburger />
                          <span>Lunch</span>
                        </div>
                      )}
                      {plan.includesDinner && (
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200">
                          <FaPizzaSlice />
                          <span>Dinner</span>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {mealPlans.length === 0 && (
              <div className={cn('text-center', 'py-12', 'bg-white', 'rounded-xl', 'border-2', 'border-dashed', 'border-orange-300')}>
                <FaCoffee className={cn('mx-auto', 'text-orange-400', 'text-4xl', 'mb-4')} />
                <p className="text-base text-orange-600 font-bold mb-2">
                  No meal plans available
                </p>
                <p className="text-sm text-orange-500">
                  Please create meal plans first to assign them to this hotel
                </p>
              </div>
            )}
            <div className="mt-6 p-4 bg-white rounded-xl border-2 border-orange-200 shadow-sm">
              <p className="text-sm text-orange-800 font-bold flex items-center gap-2 mb-1">
                <span className="text-lg">🍽️</span>
                Selected Plans: {formData.mealPlanIds.length}
              </p>
              <p className="text-xs text-orange-600">
                Select the meal plans that will be available at this hotel
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg border">
            <h4 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-6', 'pb-3', 'border-b', 'border-gray-200', 'flex', 'items-center', 'gap-3')}>
              <div className={cn('p-2', 'bg-purple-100', 'rounded-lg')}>
                <FaEdit className="text-purple-600" />
              </div>
              Additional Details
            </h4>
            <div>
              <label className={cn('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2')}>
                Hotel Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'resize-none', 'bg-white', 'shadow-sm')}
                placeholder="Enter a detailed description of the hotel, its unique features, location highlights, and what makes it special for guests..."
              />
              <p className="text-xs text-gray-500 mt-2">
                This description will be shown to guests when they view your hotel. Make it engaging and informative.
              </p>
            </div>
          </div>

          {/* Hotel Images Upload Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100 shadow-lg">
            <h4 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-6', 'pb-3', 'border-b', 'border-indigo-200', 'flex', 'items-center', 'gap-3')}>
              <div className={cn('p-2', 'bg-indigo-100', 'rounded-lg')}>
                <FaImage className="text-indigo-600" />
              </div>
              Hotel Images
            </h4>
            <HotelImageUpload
              images={formData.images}
              onImagesChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
              maxImages={6}
            />
            <div className="mt-4 p-4 bg-white rounded-xl border-2 border-indigo-200 shadow-sm">
              <p className="text-sm text-indigo-800 font-bold flex items-center gap-2 mb-1">
                <span className="text-lg">📸</span>
                Upload high-quality images
              </p>
              <p className="text-xs text-indigo-600">
                Add up to 6 professional photos of your hotel. The first image will be used as the main display photo.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className={cn('flex', 'justify-end', 'gap-4', 'pt-8', 'border-t-2', 'border-gray-200', 'bg-white', 'rounded-xl', 'p-8', 'shadow-lg')}>
            <Link
              href="/admin-dashboard/hotel-management"
              className={cn('px-8', 'py-3', 'text-gray-700', 'font-semibold', 'bg-white', 'border-2', 'border-gray-300', 'rounded-xl', 'hover:bg-gray-50', 'hover:border-gray-400', 'transition-all', 'duration-200', 'shadow-sm')}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={cn('px-10', 'py-3', 'bg-gradient-to-r', 'from-yellow-600', 'to-orange-600', 'text-white', 'font-bold', 'rounded-xl', 'hover:from-yellow-700', 'hover:to-orange-700', 'transition-all', 'duration-200', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'flex', 'items-center', 'gap-3', 'shadow-lg', 'hover:shadow-xl', 'transform', 'hover:scale-105')}
            >
              {submitting ? (
                <>
                  <div className={cn('animate-spin', 'rounded-full', 'h-5', 'w-5', 'border-2', 'border-white', 'border-t-transparent')}></div>
                  Updating Hotel...
                </>
              ) : (
                <>
                  <FaSave className="text-lg" />
                  Update Hotel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotelClient;
