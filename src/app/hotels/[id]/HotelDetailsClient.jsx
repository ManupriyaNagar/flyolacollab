"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBed,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaRegHeart,
  FaSnowflake,
  FaStar,
  FaTv,
  FaUsers
} from "react-icons/fa";

export default function HotelDetailsClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get search parameters
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

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      try {
        // Import API service
        const API = (await import('@/services/api')).default;
        
        // Fetch hotel details from API
        const response = await API.hotels.getHotelById(params.id);
        
        if (!response || !response.data) {
          setHotel(null);
          setLoading(false);
          return;
        }
        
        const hotelData = response.data;
        
        // Parse images
        let imagesArray = [];
        if (hotelData.images) {
          if (typeof hotelData.images === 'string') {
            try {
              imagesArray = JSON.parse(hotelData.images);
            } catch (e) {
              console.error('Failed to parse images:', e);
            }
          } else if (Array.isArray(hotelData.images)) {
            imagesArray = hotelData.images;
          }
        }
        
        // Get image URLs
        const imageUrls = imagesArray.map(img => img.url).filter(Boolean);
        if (imageUrls.length === 0 && hotelData.image_url) {
          imageUrls.push(hotelData.image_url);
        }
        
        // Parse amenities
        let amenitiesArray = [];
        if (hotelData.amenities) {
          if (typeof hotelData.amenities === 'string') {
            try {
              amenitiesArray = JSON.parse(hotelData.amenities);
            } catch (e) {
              console.error('Failed to parse amenities:', e);
            }
          } else if (Array.isArray(hotelData.amenities)) {
            amenitiesArray = hotelData.amenities;
          }
        }
        
        // Map amenities to include icons
        const amenityIcons = {
          swimming_pool: { icon: null, label: "Swimming Pool" },
          fitness_center: { icon: null, label: "Fitness Center" },
          spa: { icon: null, label: "Spa & Wellness" },
          restaurant: { icon: null, label: "Restaurant" },
          bar: { icon: null, label: "Bar/Lounge" },
          room_service: { icon: null, label: "24/7 Room Service" },
          free_wifi: { icon: null, label: "Free WiFi" },
          parking: { icon: null, label: "Free Parking" },
          ac: { icon: FaSnowflake, label: "Air Conditioning" },
          tv: { icon: FaTv, label: "TV" }
        };
        
        const mappedAmenities = amenitiesArray.map(amenityId => ({
          id: amenityId,
          label: amenityIcons[amenityId]?.label || amenityId.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          icon: amenityIcons[amenityId]?.icon || FaCheckCircle
        }));
        
        
        // Fetch actual rooms for this hotel (not room categories!)
        const roomsResponse = await API.hotels.getRoomsByHotel(params.id);
        const hotelRooms = roomsResponse?.data || [];
        
        // Fetch room categories to get additional details (NOT prices - prices are in rooms)
        const categoriesResponse = await API.hotels.getRoomCategories();
        const categories = categoriesResponse?.data || [];
        
        // Group rooms by category and count availability
        const roomsByCategory = {};
        
        hotelRooms.forEach((room) => {
          const categoryId = room.room_category_id || room.roomCategoryId;
          const isAvailable = room.is_available || room.isAvailable;
          const status = room.status;
          
          if (!roomsByCategory[categoryId]) {
            roomsByCategory[categoryId] = {
              rooms: [],
              availableCount: 0,
              totalCount: 0,
              lowestPrice: Infinity,
              categoryId: categoryId
            };
          }
          
          roomsByCategory[categoryId].rooms.push(room);
          roomsByCategory[categoryId].totalCount++;
          
          // Count available rooms - check if is_available is true OR status is 0 (active)
          // More lenient check: room is available if either flag is set
          const isRoomAvailable = (isAvailable === true || isAvailable === 1 || isAvailable === '1') ||
                                 (status === 0 || status === '0' || status === null || status === undefined);
          
          if (isRoomAvailable) {
            roomsByCategory[categoryId].availableCount++;
          }
          
          // Track lowest price from actual rooms
          const roomPrice = room.base_price || room.basePrice || room.price_per_night || room.pricePerNight || 0;
          if (roomPrice > 0 && roomPrice < roomsByCategory[categoryId].lowestPrice) {
            roomsByCategory[categoryId].lowestPrice = roomPrice;
          }
        });
        
        console.log('Rooms by category:', roomsByCategory);
        console.log('Total hotel rooms fetched:', hotelRooms.length);
        
        // Map grouped rooms to display format
        const mappedRooms = Object.values(roomsByCategory)
          .filter(group => group.availableCount > 0) // Only show categories with available rooms
          .map((group) => {
            const category = categories.find(c => c.id === group.categoryId);
            const firstRoom = group.rooms[0]; // Use first room for reference
            
            // Get price from room, not from category
            const roomPrice = group.lowestPrice !== Infinity ? group.lowestPrice : 0;
            
            return {
              id: firstRoom.id, // Use first available room's ID for booking
              categoryId: group.categoryId,
              name: category?.name || 'Standard Room',
              description: category?.description || 'Comfortable room with modern amenities',
              price: roomPrice,
              originalPrice: roomPrice > 0 ? roomPrice * 1.2 : 0,
              maxGuests: category?.maxOccupancy || category?.max_occupancy || 2,
              bedType: category?.bedType || category?.bed_type || 'King Bed',
              size: category?.roomSize || category?.room_size || '35 sqm',
              amenities: category?.amenities ? 
                        (Array.isArray(category.amenities) ? category.amenities : 
                         (typeof category.amenities === 'string' ? JSON.parse(category.amenities) : [])) : [],
              images: category?.imageUrl || category?.image_url ? 
                     [category.imageUrl || category.image_url] : ['/api/placeholder/300/200'],
              available: group.availableCount, // Show actual count of available rooms
              totalRooms: group.totalCount,
              allRoomIds: group.rooms
                .filter(r => {
                  const rAvail = r.is_available || r.isAvailable;
                  const rStatus = r.status;
                  return (rAvail === true || rAvail === 1 || rAvail === '1') ||
                         (rStatus === 0 || rStatus === '0' || rStatus === null || rStatus === undefined);
                })
                .map(r => r.id) // Store all available room IDs for booking
            };
          });
        
        // Map hotel data
        const mappedHotel = {
          id: hotelData.id,
          name: hotelData.name,
          location: typeof hotelData.city === 'object' ? hotelData.city?.name : hotelData.city || 'Location',
          address: hotelData.address || '',
          rating: hotelData.star_rating || hotelData.starRating || 4,
          reviews: hotelData.total_reviews || 0,
          images: imageUrls.length > 0 ? imageUrls : ['/api/placeholder/800/600'],
          amenities: mappedAmenities,
          description: hotelData.description || 'Experience luxury and comfort at this hotel.',
          contact: {
            phone: hotelData.contact_phone || hotelData.contactPhone || 'N/A',
            email: hotelData.contact_email || hotelData.contactEmail || 'N/A'
          },
          rooms: mappedRooms.length > 0 ? mappedRooms : [],
          policies: {
            checkin: hotelData.check_in_time || hotelData.checkInTime || '3:00 PM',
            checkout: hotelData.check_out_time || hotelData.checkOutTime || '12:00 PM',
            cancellation: 'Free cancellation up to 24 hours before check-in',
            pets: 'Pets not allowed',
            smoking: 'Non-smoking property'
          }
        };
        
        setHotel(mappedHotel);
        if (mappedHotel.rooms.length > 0) {
          setSelectedRoom(mappedHotel.rooms[0]);
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [params.id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'p-6')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <div className={cn('animate-pulse', 'space-y-6')}>
            <div className={cn('h-8', 'bg-gray-200', 'rounded', 'w-1/4')}></div>
            <div className={cn('h-64', 'bg-gray-200', 'rounded')}></div>
            <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-6')}>
              <div className={cn('lg:col-span-2', 'space-y-4')}>
                <div className={cn('h-6', 'bg-gray-200', 'rounded', 'w-1/3')}></div>
                <div className={cn('h-4', 'bg-gray-200', 'rounded')}></div>
                <div className={cn('h-4', 'bg-gray-200', 'rounded', 'w-2/3')}></div>
              </div>
              <div className="space-y-4">
                <div className={cn('h-32', 'bg-gray-200', 'rounded')}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <h1 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'mb-4')}>Hotel Not Found</h1>
          <Button asChild>
            <Link href="/hotels">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>
      {/* Header */}
      <div >
        <div className={cn('max-w-[1230px]', 'mx-auto', 'px-6', 'py-4' , 'rounded-xl', 'bg-white' , 'shadow-md')}>
       
          
          <div className={cn('flex', 'flex-col', 'md:flex-row', 'md:items-center', 'md:justify-between', 'gap-4')}>
            <div>
              <div className={cn('flex', 'items-center', 'gap-4', 'mb-2')}>
                <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900')}>{hotel.name}</h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn('p-2', 'hover:bg-gray-100', 'rounded-full', 'transition-colors')}
                >
                  {isFavorite ? (
                    <FaHeart className={cn('w-5', 'h-5', 'text-red-500')} />
                  ) : (
                    <FaRegHeart className={cn('w-5', 'h-5', 'text-gray-600')} />
                  )}
                </button>
              </div>
              
              <div className={cn('flex', 'items-center', 'gap-4', 'text-gray-600', 'mb-2')}>
                <div className={cn('flex', 'items-center', 'gap-1')}>
                  <FaMapMarkerAlt className={cn('w-4', 'h-4')} />
                  <span>{hotel.location}</span>
                </div>
                <div className={cn('flex', 'items-center', 'gap-1')}>
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
                  <span className={cn('ml-1', 'font-medium')}>{hotel.rating}</span>
                  <span>({hotel.reviews} reviews)</span>
                </div>
              </div>
              
              <p className="text-gray-600">{hotel.address}</p>
            </div>
            
            <div className="text-right">
              <div className={cn('text-sm', 'text-gray-600', 'mb-1')}>
                {formatDate(checkin)} - {formatDate(checkout)}
              </div>
              <div className={cn('text-sm', 'text-gray-600')}>
                {nights} night{nights !== 1 ? 's' : ''} • {rooms} room{rooms !== 1 ? 's' : ''} • {adults + children} guest{adults + children !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('max-w-7xl', 'mx-auto', 'px-6', 'py-6')}>
        <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-6')}>
          {/* Main Content */}
          <div className={cn('lg:col-span-2', 'space-y-6')}>
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className={cn('grid', 'grid-cols-2', 'gap-2')}>
                  <div className={cn('col-span-2', 'md:col-span-1')}>
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className={cn('w-full', 'h-64', 'md:h-80', 'object-cover', 'rounded-l-lg')}
                    />
                  </div>
                  <div className={cn( 'md:grid', 'grid-cols-2', 'gap-2')}>
                    {hotel.images.slice(1, 8).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${hotel.name} ${index + 2}`}
                        className={cn('w-full', 'h-[156px]', 'object-cover', 'rounded-lg')}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Hotel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn('text-gray-600', 'leading-relaxed')}>{hotel.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn('grid', 'grid-cols-2', 'md:grid-cols-3', 'gap-4')}>
                  {hotel.amenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={amenity.id} className={cn('flex', 'items-center', 'gap-3')}>
                        <IconComponent className={cn('w-5', 'h-5', 'text-blue-600')} />
                        <span className="text-gray-700">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Available Rooms */}
            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-all",
                      selectedRoom?.id === room.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className={cn('flex', 'flex-col', 'md:flex-row', 'gap-4')}>
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className={cn('w-full', 'md:w-32', 'h-24', 'object-cover', 'rounded')}
                      />
                      
                      <div className="flex-1">
                        <div className={cn('flex', 'justify-between', 'items-start', 'mb-2')}>
                          <h4 className={cn('font-semibold', 'text-lg')}>{room.name}</h4>
                          <div className="text-right">
                            {room.originalPrice > room.price && (
                              <div className={cn('text-sm', 'text-gray-500', 'line-through')}>
                                ₹{room.originalPrice.toLocaleString()}
                              </div>
                            )}
                            <div className={cn('text-xl', 'font-bold', 'text-gray-900')}>
                              ₹{room.price.toLocaleString()}
                            </div>
                            <div className={cn('text-sm', 'text-gray-600')}>per night</div>
                          </div>
                        </div>
                        
                        <p className={cn('text-gray-600', 'text-sm', 'mb-3')}>{room.description}</p>
                        
                        <div className={cn('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-2', 'text-sm', 'text-gray-600', 'mb-3')}>
                          <div className={cn('flex', 'items-center', 'gap-1')}>
                            <FaBed className={cn('w-4', 'h-4')} />
                            {room.bedType}
                          </div>
                          <div className={cn('flex', 'items-center', 'gap-1')}>
                            <FaUsers className={cn('w-4', 'h-4')} />
                            Max {room.maxGuests} guests
                          </div>
                          <div>{room.size}</div>
                          <div className={cn('text-green-600', 'font-medium')}>
                            {room.available} rooms left
                          </div>
                        </div>
                        
                        <div className={cn('flex', 'flex-wrap', 'gap-1')}>
                          {room.amenities.slice(0, 4).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Hotel Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                  <div>
                    <h5 className={cn('font-medium', 'mb-2')}>Check-in / Check-out</h5>
                    <p className={cn('text-sm', 'text-gray-600')}>Check-in: {hotel.policies.checkin}</p>
                    <p className={cn('text-sm', 'text-gray-600')}>Check-out: {hotel.policies.checkout}</p>
                  </div>
                  <div>
                    <h5 className={cn('font-medium', 'mb-2')}>Cancellation</h5>
                    <p className={cn('text-sm', 'text-gray-600')}>{hotel.policies.cancellation}</p>
                  </div>
                  <div>
                    <h5 className={cn('font-medium', 'mb-2')}>Pet Policy</h5>
                    <p className={cn('text-sm', 'text-gray-600')}>{hotel.policies.pets}</p>
                  </div>
                  <div>
                    <h5 className={cn('font-medium', 'mb-2')}>Smoking Policy</h5>
                    <p className={cn('text-sm', 'text-gray-600')}>{hotel.policies.smoking}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">





  {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Hotel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={cn('flex', 'items-center', 'gap-3')}>
                  <FaPhone className={cn('w-4', 'h-4', 'text-blue-600')} />
                  <span className="text-sm">{hotel.contact.phone}</span>
                </div>
                <div className={cn('flex', 'items-center', 'gap-3')}>
                  <FaEnvelope className={cn('w-4', 'h-4', 'text-blue-600')} />
                  <span className="text-sm">{hotel.contact.email}</span>
                </div>
              </CardContent>
            </Card>










            <Card className={cn('sticky', 'top-16')}>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRoom && (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-semibold">{selectedRoom.name}</h4>
                      <div className={cn('text-sm', 'text-gray-600', 'space-y-1')}>
                        <div className={cn('flex', 'items-center', 'gap-2')}>
                          <FaCalendarAlt className={cn('w-4', 'h-4')} />
                          <span>{formatDate(checkin)}</span>
                        </div>
                        <div className={cn('flex', 'items-center', 'gap-2')}>
                          <FaCalendarAlt className={cn('w-4', 'h-4')} />
                          <span>{formatDate(checkout)}</span>
                        </div>
                        <div className={cn('flex', 'items-center', 'gap-2')}>
                          <FaBed className={cn('w-4', 'h-4')} />
                          <span>{rooms} room{rooms !== 1 ? 's' : ''}</span>
                        </div>
                        <div className={cn('flex', 'items-center', 'gap-2')}>
                          <FaUsers className={cn('w-4', 'h-4')} />
                          <span>{adults + children} guest{adults + children !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className={cn('flex', 'justify-between')}>
                        <span>₹{selectedRoom.price.toLocaleString()} × {nights} nights</span>
                        <span>₹{(selectedRoom.price * nights).toLocaleString()}</span>
                      </div>
                      <div className={cn('flex', 'justify-between')}>
                        <span>Taxes & fees</span>
                        <span>₹{Math.round(selectedRoom.price * nights * 0.18).toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className={cn('flex', 'justify-between', 'font-bold', 'text-lg')}>
                        <span>Total</span>
                        <span>₹{Math.round(selectedRoom.price * nights * 1.18).toLocaleString()}</span>
                      </div>
                    </div>

                    <Button 
                      asChild
                      className={cn('w-full', 'bg-blue-600', 'hover:bg-blue-700')} 
                      size="lg"
                    >
                      <Link
                        href={{
                          pathname: '/hotels/booking',
                          query: {
                            hotelId: hotel.id,
                            hotelName: hotel.name,
                            hotelImage: hotel.image_url || hotel.imageUrl || hotel.images?.[0] || '',
                            location: hotel.location,
                            rating: hotel.rating,
                            roomId: selectedRoom.id,
                            roomName: selectedRoom.name,
                            roomPrice: selectedRoom.price,
                            checkin,
                            checkout,
                            rooms,
                            adults,
                            children
                          }
                        }}
                      >
                        Book Now
                      </Link>
                    </Button>

                    <div className={cn('flex', 'items-center', 'justify-center', 'gap-2', 'text-sm', 'text-green-600')}>
                      <FaCheckCircle className={cn('w-4', 'h-4')} />
                      <span>Free cancellation until 24 hours before check-in</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

          
          </div>
        </div>
      </div>

      
    </div>
  );
}