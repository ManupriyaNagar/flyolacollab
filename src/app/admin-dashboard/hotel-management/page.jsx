"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaEnvelope,
  FaEye,
  FaFilter,
  FaHotel,
  FaMapMarkerAlt,
  FaPhone,
  FaPlus,
  FaSearch,
  FaStar,
  FaTrash
} from "react-icons/fa";
import { toast } from "react-toastify";

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Hotel amenities for display
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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch cities and hotels in parallel
        const [citiesResponse, hotelsResponse] = await Promise.all([
          API.hotels.getCities().catch(() => ({ data: [] })),
          API.hotels.getHotels().catch(() => ({ data: [] }))
        ]);

        // Set cities data
        if (citiesResponse.data && Array.isArray(citiesResponse.data)) {
          setCities(citiesResponse.data);
        } else {
          setCities([]);
        }

        // Set hotels data
        if (hotelsResponse.data && Array.isArray(hotelsResponse.data)) {
          setHotels(hotelsResponse.data);
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        toast.error('Failed to fetch hotel data');
        setCities([]);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredHotels = hotels.filter(hotel => {
    const cityName = typeof hotel.city === 'object' ? hotel.city?.name : hotel.city;
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cityName && cityName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === "" || cityName === selectedCity;
    const matchesRating = selectedRating === "" || hotel.starRating.toString() === selectedRating;
    
    return matchesSearch && matchesCity && matchesRating;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
        size={16}
      />
    ));
  };

  const handleDeleteHotel = async (hotelId) => {
    if (confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      try {
        await API.hotels.deleteHotel(hotelId);
        setHotels(prev => prev.filter(h => h.id !== hotelId));
        toast.success('Hotel deleted successfully!');
      } catch (error) {
        console.error('Error deleting hotel:', error);
        toast.error('Failed to delete hotel. Please try again.');
      }
    }
  };

  const handleViewHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  const SkeletonCard = () => (
    <div className={cn('bg-white', 'rounded-xl', 'shadow-md', 'border', 'border-gray-200', 'overflow-hidden', 'animate-pulse')}>
      <div className={cn('h-48', 'bg-gray-200')}></div>
      <div className="p-6">
        <div className={cn('h-6', 'bg-gray-200', 'rounded', 'mb-2')}></div>
        <div className={cn('h-4', 'bg-gray-200', 'rounded', 'w-3/4', 'mb-4')}></div>
        <div className={cn('space-y-2', 'mb-4')}>
          <div className={cn('h-4', 'bg-gray-200', 'rounded')}></div>
          <div className={cn('h-4', 'bg-gray-200', 'rounded', 'w-1/2')}></div>
        </div>
        <div className={cn('flex', 'gap-2')}>
          <div className={cn('flex-1', 'h-10', 'bg-gray-200', 'rounded-lg')}></div>
          <div className={cn('h-10', 'w-10', 'bg-gray-200', 'rounded-lg')}></div>
          <div className={cn('h-10', 'w-10', 'bg-gray-200', 'rounded-lg')}></div>
        </div>
      </div>
    </div>
  );

  const HotelCard = ({ hotel }) => (
    <motion.div
      className={cn('bg-white', 'rounded-xl', 'shadow-lg', 'border', 'border-gray-200', 'overflow-hidden', 'hover:shadow-xl', 'transition-all', 'duration-300', 'group')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        {(() => {
          // Parse images if it's a JSON string
          let imagesArray = [];
          if (hotel.images) {
            if (typeof hotel.images === 'string') {
              try {
                imagesArray = JSON.parse(hotel.images);
              } catch (e) {
                console.error('Failed to parse images:', e);
              }
            } else if (Array.isArray(hotel.images)) {
              imagesArray = hotel.images;
            }
          }
          
          // Get main image from images array
          const mainImage = imagesArray.find(img => img.isMain);
          const imageUrl = mainImage?.url || hotel.imageUrl || hotel.image_url;
          
          return imageUrl ? (
            <img 
              src={imageUrl} 
              alt={hotel.name}
              className={cn('h-48', 'w-full', 'object-cover', 'group-hover:scale-105', 'transition-transform', 'duration-300')}
            />
          ) : (
            <div className={cn('h-48', 'bg-gradient-to-r', 'from-blue-400', 'to-blue-600', 'flex', 'items-center', 'justify-center')}>
              <FaHotel className={cn('text-white', 'text-6xl', 'opacity-50')} />
            </div>
          );
        })()}
        <div className={cn('absolute', 'top-4', 'right-4')}>
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
            hotel.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {hotel.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className={cn('flex', 'items-start', 'justify-between', 'mb-3')}>
          <div>
            <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-1', 'group-hover:text-blue-600', 'transition-colors')}>{hotel.name}</h3>
            <div className={cn('flex', 'items-center', 'gap-1', 'mb-2')}>
              {renderStars(hotel.starRating)}
              <span className={cn('text-sm', 'text-gray-600', 'ml-1')}>({hotel.starRating} Star)</span>
            </div>
          </div>
        </div>

        <div className={cn('space-y-2', 'mb-4')}>
          <div className={cn('flex', 'items-center', 'text-gray-600', 'text-sm')}>
            <FaMapMarkerAlt className={cn('mr-2', 'text-blue-500')} />
            <span className="truncate">{hotel.address}</span>
          </div>
          <div className={cn('flex', 'items-center', 'text-gray-600', 'text-sm')}>
            <FaPhone className={cn('mr-2', 'text-green-500')} />
            <span>{hotel.contactPhone}</span>
          </div>
          <div className={cn('flex', 'items-center', 'text-gray-600', 'text-sm')}>
            <FaEnvelope className={cn('mr-2', 'text-purple-500')} />
            <span className="truncate">{hotel.contactEmail}</span>
          </div>
        </div>

        {/* Amenities Preview */}
        {hotel.amenities && Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
          <div className="mb-4">
            <p className={cn('text-xs', 'font-semibold', 'text-gray-700', 'mb-2')}>Amenities:</p>
            <div className={cn('flex', 'flex-wrap', 'gap-1')}>
              {hotel.amenities.slice(0, 4).map(amenityId => {
                const amenity = hotelAmenities.find(a => a.id === amenityId);
                return amenity ? (
                  <span key={amenityId} className="text-lg" title={amenity.label}>
                    {amenity.icon}
                  </span>
                ) : null;
              })}
              {hotel.amenities.length > 4 && (
                <span className={cn('text-xs', 'text-gray-500', 'ml-1')}>+{hotel.amenities.length - 4} more</span>
              )}
            </div>
          </div>
        )}

        <div className={cn('grid', 'grid-cols-2', 'gap-4', 'mb-4')}>
          <div className={cn('text-center', 'p-3', 'bg-blue-50', 'rounded-lg')}>
            <div className={cn('text-2xl', 'font-bold', 'text-blue-600')}>{hotel.totalRooms || 0}</div>
            <div className={cn('text-xs', 'text-gray-600')}>Total Rooms</div>
          </div>
          <div className={cn('text-center', 'p-3', 'bg-green-50', 'rounded-lg')}>
            <div className={cn('text-2xl', 'font-bold', 'text-green-600')}>{hotel.availableRooms}</div>
            <div className={cn('text-xs', 'text-gray-600')}>Available</div>
          </div>
        </div>

        <div className={cn('flex', 'gap-2')}>
          <button 
            onClick={() => handleViewHotel(hotel)}
            className={cn('flex-1', 'bg-blue-600', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'justify-center', 'gap-2', 'text-sm', 'font-medium')}
          >
            <FaEye size={14} />
            View Details
          </button>
          <Link 
            href={`/admin-dashboard/hotel-management/edit/${hotel.id}`}
            className={cn('bg-yellow-500', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-yellow-600', 'transition-colors', 'flex', 'items-center', 'justify-center')}
          >
            <FaEdit size={14} />
          </Link>
          <button 
            onClick={() => handleDeleteHotel(hotel.id)}
            className={cn('bg-red-500', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-red-600', 'transition-colors')}
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </motion.div>
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
                  <FaHotel className="text-blue-600" />
                  Hotel Management
                </h1>
                <p className={cn('text-gray-600', 'mt-1')}>Manage your hotel properties and inventory</p>
              </div>
              <Link 
                href="/admin-dashboard/hotel-management/add"
                className={cn('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2', 'font-medium')}
              >
                <FaPlus />
                Add New Hotel
              </Link>
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
                <FaHotel className="text-blue-600" />
                Hotel Management
              </h1>
              <p className={cn('text-gray-600', 'mt-1')}>Manage your hotel properties and inventory</p>
            </div>
            <Link 
              href="/admin-dashboard/hotel-management/add"
              className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'text-white', 'px-6', 'py-3', 'rounded-xl', 'hover:from-blue-700', 'hover:to-indigo-700', 'transition-all', 'flex', 'items-center', 'gap-2', 'font-semibold', 'shadow-lg', 'hover:shadow-xl', 'transform', 'hover:scale-105')}
            >
              <FaPlus />
              Add New Hotel
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
        <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'p-6', 'mb-6')}>
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4')}>
            <div className="relative">
              <FaSearch className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
              <input
                type="text"
                placeholder="Search hotels..."
                className={cn('w-full', 'pl-10', 'pr-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all')}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </select>

            <select
              className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-gray-200', 'rounded-xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all')}
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Star</option>
              <option value="4">4 Star</option>
              <option value="3">3 Star</option>
              <option value="2">2 Star</option>
              <option value="1">1 Star</option>
            </select>

            <button className={cn('bg-gray-100', 'text-gray-700', 'px-4', 'py-3', 'rounded-xl', 'hover:bg-gray-200', 'transition-colors', 'flex', 'items-center', 'justify-center', 'gap-2', 'font-medium')}>
              <FaFilter />
              More Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6', 'mb-8')}>
          <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Hotels</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>{hotels.length}</p>
              </div>
              <div className={cn('bg-blue-100', 'p-3', 'rounded-full')}>
                <FaHotel className={cn('text-blue-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Rooms</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>
                  {hotels.reduce((sum, hotel) => sum + (hotel.totalRooms || 0), 0)}
                </p>
              </div>
              <div className={cn('bg-green-100', 'p-3', 'rounded-full')}>
                <FaHotel className={cn('text-green-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Available Rooms</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>
                  {hotels.reduce((sum, hotel) => sum + (hotel.availableRooms || 0), 0)}
                </p>
              </div>
              <div className={cn('bg-yellow-100', 'p-3', 'rounded-full')}>
                <FaHotel className={cn('text-yellow-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Occupancy Rate</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>
                  {(() => {
                    const totalRooms = hotels.reduce((sum, hotel) => sum + (hotel.totalRooms || 0), 0);
                    const availableRooms = hotels.reduce((sum, hotel) => sum + (hotel.availableRooms || 0), 0);
                    const occupiedRooms = totalRooms - availableRooms;
                    return totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
                  })()}%
                </p>
              </div>
              <div className={cn('bg-purple-100', 'p-3', 'rounded-full')}>
                <FaHotel className={cn('text-purple-600', 'text-xl')} />
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className={cn('text-center', 'py-12')}>
            <FaHotel className={cn('mx-auto', 'text-gray-400', 'text-6xl', 'mb-4')} />
            <h3 className={cn('text-xl', 'font-medium', 'text-gray-900', 'mb-2')}>No hotels found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new hotel.</p>
          </div>
        )}
      </div>

      {/* Hotel Details Modal */}
      {selectedHotel && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-2xl', 'max-w-4xl', 'w-full', 'max-h-[80vh]', 'overflow-y-auto', 'shadow-2xl')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
                  <FaHotel className="text-blue-600" />
                  Hotel Details
                </h3>
                <button
                  onClick={() => setSelectedHotel(null)}
                  className={cn('p-2', 'text-gray-400', 'hover:text-gray-600', 'hover:bg-gray-100', 'rounded-lg', 'transition-colors')}
                >
                  <svg className={cn('w-6', 'h-6')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={cn('p-6', 'space-y-6')}>
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
                <div>
                  <h4 className={cn('text-sm', 'font-medium', 'text-gray-700', 'mb-3')}>Basic Information</h4>
                  <div className="space-y-2">
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>Hotel Name:</span>
                      <span className={cn('text-sm', 'font-medium')}>{selectedHotel.name}</span>
                    </div>
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>City:</span>
                      <span className={cn('text-sm', 'font-medium')}>{typeof selectedHotel.city === 'object' ? selectedHotel.city?.name : selectedHotel.city}</span>
                    </div>
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>Star Rating:</span>
                      <div className={cn('flex', 'items-center', 'gap-1')}>
                        {renderStars(selectedHotel.starRating)}
                      </div>
                    </div>
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedHotel.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedHotel.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className={cn('text-sm', 'font-medium', 'text-gray-700', 'mb-3')}>Contact Information</h4>
                  <div className="space-y-2">
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>Phone:</span>
                      <span className={cn('text-sm', 'font-medium')}>{selectedHotel.contactPhone}</span>
                    </div>
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>Email:</span>
                      <span className={cn('text-sm', 'font-medium')}>{selectedHotel.contactEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className={cn('text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Address</h4>
                  <p className={cn('text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg')}>{selectedHotel.address}</p>
                </div>

                {selectedHotel.amenities && Array.isArray(selectedHotel.amenities) && selectedHotel.amenities.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className={cn('text-sm', 'font-medium', 'text-gray-700', 'mb-3')}>Hotel Amenities</h4>
                    <div className={cn('flex', 'flex-wrap', 'gap-2')}>
                      {selectedHotel.amenities.map(amenityId => {
                        const amenity = hotelAmenities.find(a => a.id === amenityId);
                        return amenity ? (
                          <span key={amenityId} className={cn('inline-flex', 'items-center', 'gap-2', 'px-3', 'py-1', 'bg-blue-100', 'text-blue-800', 'text-xs', 'font-medium', 'rounded-full')}>
                            <span>{amenity.icon}</span>
                            {amenity.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {selectedHotel.description && (
                  <div className="md:col-span-2">
                    <h4 className={cn('text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Description</h4>
                    <p className={cn('text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg')}>{selectedHotel.description}</p>
                  </div>
                )}

                <div>
                  <h4 className={cn('text-sm', 'font-medium', 'text-gray-700', 'mb-3')}>Room Information</h4>
                  <div className="space-y-2">
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>Total Rooms:</span>
                      <span className={cn('text-sm', 'font-medium')}>{selectedHotel.totalRooms || 0}</span>
                    </div>
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>Available Rooms:</span>
                      <span className={cn('text-sm', 'font-medium', 'text-green-600')}>{selectedHotel.availableRooms}</span>
                    </div>
                    <div className={cn('flex', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-500')}>Occupancy Rate:</span>
                      <span className={cn('text-sm', 'font-medium')}>
                        {selectedHotel.totalRooms && selectedHotel.availableRooms 
                          ? Math.round(((selectedHotel.totalRooms - selectedHotel.availableRooms) / selectedHotel.totalRooms) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4', 'border-t', 'border-gray-200')}>
                <Link
                  href={`/admin-dashboard/hotel-management/edit/${selectedHotel.id}`}
                  className={cn('px-6', 'py-2', 'bg-yellow-500', 'text-white', 'rounded-lg', 'hover:bg-yellow-600', 'transition-colors', 'flex', 'items-center', 'gap-2', 'font-medium')}
                >
                  <FaEdit />
                  Edit Hotel
                </Link>
                <button
                  onClick={() => setSelectedHotel(null)}
                  className={cn('px-6', 'py-2', 'bg-gray-500', 'text-white', 'rounded-lg', 'hover:bg-gray-600', 'transition-colors', 'font-medium')}
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

export default HotelManagement;