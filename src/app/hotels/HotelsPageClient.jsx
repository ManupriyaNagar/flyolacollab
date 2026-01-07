"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FaCar,
    FaHeart,
    FaMapMarkerAlt,
    FaRegHeart,
    FaSearch,
    FaSnowflake,
    FaStar,
    FaSwimmingPool,
    FaTv,
    FaUtensils,
    FaWifi
} from "react-icons/fa";

export default function HotelsPageClient() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreSuggested, setShowMoreSuggested] = useState(false);
  const [selectedSuggested, setSelectedSuggested] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedStarRatings, setSelectedStarRatings] = useState([]);
  const [selectedUserRatings, setSelectedUserRatings] = useState([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    starRating: [],
    amenities: [],
    propertyType: []
  });

  // Get search parameters
  const destination = searchParams.get("destination") || "";
  const checkin = searchParams.get("checkin") || "";
  const checkout = searchParams.get("checkout") || "";
  const rooms = parseInt(searchParams.get("rooms")) || 1;
  const adults = parseInt(searchParams.get("adults")) || 2;
  const children = parseInt(searchParams.get("children")) || 0;

  // Calculate nights
  const calculateNights = () => {
    if (!checkin || !checkout) return 1;
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = Math.abs(checkoutDate - checkinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const response = await API.hotels.getHotels();
        
        if (response && response.data && Array.isArray(response.data)) {
          // Map API data to component format
          const mappedHotels = response.data.map(hotel => {
            // Parse images if it's a JSON string
            let imagesArray = [];
            if (hotel.images) {
              if (typeof hotel.images === 'string') {
                try {
                  imagesArray = JSON.parse(hotel.images);
                } catch (e) {
                  console.error('Failed to parse images for hotel:', hotel.name, e);
                }
              } else if (Array.isArray(hotel.images)) {
                imagesArray = hotel.images;
              }
            }
            
            // Get main image from images array
            const mainImage = imagesArray.find(img => img.isMain);
            const imageUrl = mainImage?.url || hotel.imageUrl || hotel.image_url;
            
            // Parse amenities with better error handling
            let amenitiesArray = [];
            if (hotel.amenities) {
              if (Array.isArray(hotel.amenities)) {
                amenitiesArray = hotel.amenities;
              } else if (typeof hotel.amenities === 'string') {
                try {
                  amenitiesArray = JSON.parse(hotel.amenities);
                  if (!Array.isArray(amenitiesArray)) {
                    console.warn('Parsed amenities is not an array for hotel:', hotel.name, amenitiesArray);
                    amenitiesArray = [];
                  }
                } catch (e) {
                  console.error('Failed to parse amenities for hotel:', hotel.name, e);
                  amenitiesArray = [];
                }
              }
            }
            
            console.log('Hotel:', hotel.name, 'Amenities:', amenitiesArray);
            
            return {
              id: hotel.id,
              name: hotel.name,
              location: hotel.address || hotel.city || 'Location not specified',
              rating: hotel.star_rating || hotel.starRating || 4,
              reviews: hotel.total_reviews || 0,
              price: hotel.base_price || hotel.basePrice || 0,
              originalPrice: hotel.original_price || hotel.originalPrice || (hotel.base_price ? hotel.base_price * 1.2 : 0),
              image: imageUrl,
              amenities: amenitiesArray,
              propertyType: "hotel",
              description: hotel.description || 'Comfortable stay with modern amenities',
              distance: hotel.distance || 'City center',
              status: hotel.status
            };
          });
          
          // Filter only active hotels (show all, even without images)
          const activeHotels = mappedHotels.filter(h => h.status === 0 || h.status === 'Active');
          console.log('Active hotels:', activeHotels.length, activeHotels);
          setHotels(activeHotels);
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, checkin, checkout]);

  const amenityIcons = {
    // Match the IDs from hotel add form
    swimming_pool: { icon: FaSwimmingPool, label: "Swimming Pool" },
    fitness_center: { label: "Fitness Center" },
    spa: { label: "Spa & Wellness" },
    restaurant: { icon: FaUtensils, label: "Restaurant" },
    bar: { label: "Bar/Lounge" },
    room_service: { label: "24/7 Room Service" },
    concierge: { label: "Concierge Service" },
    business_center: { label: "Business Center" },
    meeting_rooms: { label: "Meeting Rooms" },
    conference_hall: { label: "Conference Hall" },
    free_wifi: { icon: FaWifi, label: "Free WiFi" },
    parking: { icon: FaCar, label: "Free Parking" },
    airport_shuttle: { label: "Airport Shuttle" },
    laundry: { label: "Laundry Service" },
    pet_friendly: { label: "Pet Friendly" },
    kids_club: { label: "Kids Club" },
    playground: { label: "Playground" },
    garden: { label: "Garden/Terrace" },
    balcony_view: { label: "Scenic Views" },
    elevator: { label: "Elevator Access" },
    // Legacy IDs for backward compatibility
    wifi: { icon: FaWifi, label: "Free WiFi" },
    pool: { icon: FaSwimmingPool, label: "Swimming Pool" },
    ac: { icon: FaSnowflake, label: "Air Conditioning" },
    tv: { icon: FaTv, label: "TV" },
    heritage: { label: "Heritage Property" }
  };

  const toggleFavorite = (hotelId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(hotelId)) {
        newFavorites.delete(hotelId);
      } else {
        newFavorites.add(hotelId);
      }
      return newFavorites;
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter toggle functions
  const toggleSuggestedFilter = (filter) => {
    setSelectedSuggested(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const togglePriceRange = (range) => {
    setSelectedPriceRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const toggleStarRating = (rating) => {
    setSelectedStarRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const toggleUserRating = (rating) => {
    setSelectedUserRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">



      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-[260px] flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border py-6 px-4 sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search for locality / hotel "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Suggested For You */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-900 mb-3">Suggested For You</h3>
                <div className="space-y-2">
                  {[
                    { id: 'rush_deal', label: 'Rush Deal', count: 219 },
                    { id: 'last_minute', label: 'Last Minute Deals', count: null },
                    { id: '5_star', label: '5 Star', count: 84 },
                    { id: 'north_goa', label: 'North Goa', count: null },
                    { id: 'resorts', label: 'Resorts', count: 279 }
                  ].slice(0, showMoreSuggested ? 5 : 5).map((filter) => (
                    <label key={filter.id} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSuggested.includes(filter.id)}
                          onChange={() => toggleSuggestedFilter(filter.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                          {filter.label}
                        </span>
                      </div>
                      {filter.count && (
                        <span className="text-xs text-gray-500">({filter.count})</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price per night */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-900 mb-3">Price per night</h3>
                <div className="space-y-2 mb-4">
                  {[
                    { id: '0-2500', label: '₹ 0 - ₹ 2500', count: 114 },
                    { id: '2500-5000', label: '₹ 2500 - ₹ 5000', count: 477 },
                    { id: '5000-8500', label: '₹ 5000 - ₹ 8500', count: 397 },
                    { id: '8500-12000', label: '₹ 8500 - ₹ 12000', count: 127 },
                    { id: '12000-15000', label: '₹ 12000 - ₹ 15000', count: 92 },
                    { id: '15000-30000', label: '₹ 15000 - ₹ 30000', count: 165 },
                    { id: '30000+', label: '₹ 30000+', count: 113 }
                  ].map((range) => (
                    <label key={range.id} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(range.id)}
                          onChange={() => togglePriceRange(range.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                          {range.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">({range.count})</span>
                    </label>
                  ))}
                </div>

                {/* Your Budget */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Your Budget</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500 text-sm">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Star Category */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-900 mb-3">Star Category</h3>
                <div className="space-y-2">
                  {[
                    { id: '3', label: '3 Star', count: 494 },
                    { id: '4', label: '4 Star', count: 238 },
                    { id: '5', label: '5 Star', count: 84 }
                  ].map((star) => (
                    <label key={star.id} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStarRatings.includes(star.id)}
                          onChange={() => toggleStarRating(star.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                          {star.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">({star.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* User Rating */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">User Rating</h3>
                <div className="space-y-2">
                  {[
                    { id: '4.2+', label: 'Excellent: 4.2+', count: 373 },
                    { id: '3.5+', label: 'Very Good: 3.5+', count: 949 },
                    { id: '3+', label: 'Good: 3+', count: 535 }
                  ].map((rating) => (
                    <label key={rating.id} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUserRatings.includes(rating.id)}
                          onChange={() => toggleUserRating(rating.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                          {rating.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">({rating.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Hotel Results */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white shadow-sm border rounded-lg mb-4">
              <div className="px-6 py-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {hotels.length} Hotels in {destination}
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      {formatDate(checkin)} - {formatDate(checkout)} • {nights} night{nights !== 1 ? 's' : ''} • {rooms} room{rooms !== 1 ? 's' : ''} • {adults + children} guest{adults + children !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* Horizontal Scrollable Filter Bar */}
                  <div className="relative">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <button
                        onClick={() => setSortBy("popularity")}
                        className={cn(
                          "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all",
                          sortBy === "popularity"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        Popularity
                      </button>
                      <button
                        onClick={() => setSortBy("price_low")}
                        className={cn(
                          "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all",
                          sortBy === "price_low"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        Price (Low to High)
                      </button>
                      <button
                        onClick={() => setSortBy("price_high")}
                        className={cn(
                          "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all",
                          sortBy === "price_high"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        Price (High to Low)
                      </button>
                      <button
                        onClick={() => setSortBy("rating")}
                        className={cn(
                          "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all",
                          sortBy === "rating"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        User Rating (Highest)
                      </button>
                      <button
                        onClick={() => setSortBy("best_value")}
                        className={cn(
                          "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all",
                          sortBy === "best_value"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        Lowest Price & Best Rated
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={{
                  pathname: `/hotels/${hotel.id}`,
                  query: {
                    checkin,
                    checkout,
                    rooms,
                    adults,
                    children
                  }
                }}
                className="block"
              >
                <Card className="overflow-hidden  transition-all duration-300 cursor-pointer ">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Hotel Image */}
                      <div className="md:w-80 h-48 md:h-auto relative">
                        {hotel.image ? (
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(hotel.id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
                        >
                          {favorites.has(hotel.id) ? (
                            <FaHeart className="w-4 h-4 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Hotel Details */}
                      <div className="flex-1 px-6 ">
                        <div className="flex flex-col md:flex-row md:justify-between h-full">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {hotel.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                  <FaMapMarkerAlt className="w-4 h-4" />
                                  <span>{hotel.location}</span>
                                  <span>•</span>
                                  <span>{hotel.distance}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={cn(
                                      "w-4 h-4",
                                      i < Math.floor(hotel.rating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    )}
                                  />
                                ))}
                                <span className="text-sm font-medium ml-1">
                                  {hotel.rating}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">
                                ({hotel.reviews} reviews)
                              </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {hotel.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {hotel.amenities.slice(0, 4).map((amenity, idx) => {
                                const amenityInfo = amenityIcons[amenity];
                                
                                // Create a readable label from the amenity ID if no mapping exists
                                const label = amenityInfo?.label || amenity.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ');
                                
                                return (
                                  <Badge
                                    key={`${amenity}-${idx}`}
                                    variant="secondary"
                                    className="text-xs flex items-center gap-1"
                                  >
                                    {amenityInfo?.icon && (
                                      <amenityInfo.icon className="w-3 h-3" />
                                    )}
                                    {label}
                                  </Badge>
                                );
                              })}
                              {hotel.amenities.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{hotel.amenities.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Price Section */}
                          <div className="md:w-48 md:text-right">
                            <div className="mb-4">
                              {hotel.originalPrice > hotel.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  ₹{hotel.originalPrice.toLocaleString()}
                                </div>
                              )}
                              <div className="text-2xl font-bold text-gray-900">
                                ₹{hotel.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                per night + taxes
                              </div>
                              <div className="text-sm font-medium text-green-600">
                                Total: ₹{(hotel.price * nights).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
            </div>

            {hotels.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No hotels found for your search criteria
                </div>
                <Link href="/" className="inline-block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Modify Search
                </Link>
              </div>
            )}
          </div>



        </div>
      </div>
    </div>
  );
}