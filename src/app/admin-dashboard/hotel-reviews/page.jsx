"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaSearch,
  FaStar,
  FaThumbsDown,
  FaThumbsUp,
  FaTrash,
  FaUser
} from "react-icons/fa";

const HotelReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const ratings = [1, 2, 3, 4, 5];
  const statuses = [
    { value: 0, label: "Active" },
    { value: 1, label: "Hidden" }
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch reviews, hotels, and bookings in parallel
        const [reviewsResponse, hotelsResponse, bookingsResponse] = await Promise.all([
          API.hotels.getAllHotelReviews().catch((error) => {
            console.error('Reviews API Error:', error);
            return { data: [] };
          }),
          API.hotels.getHotels().catch((error) => {
            console.error('Hotels API Error:', error);
            return { data: [] };
          }),
          API.hotels.getBookings().catch((error) => {
            console.error('Bookings API Error:', error);
            return { data: [] };
          })
        ]);

        console.log('Reviews API Response:', reviewsResponse);
        
        if (reviewsResponse.data && reviewsResponse.data.data && Array.isArray(reviewsResponse.data.data)) {
          console.log('Using API data for reviews:', reviewsResponse.data.data);
          setReviews(reviewsResponse.data.data);
        } else {
          console.log('No reviews data from API');
          setReviews([]);
        }

        if (hotelsResponse.data && hotelsResponse.data.data && Array.isArray(hotelsResponse.data.data)) {
          setHotels(hotelsResponse.data.data);
        } else {
          console.log('No hotels data from API');
          setHotels([]);
        }

        if (bookingsResponse.data && bookingsResponse.data.data && Array.isArray(bookingsResponse.data.data)) {
          setBookings(bookingsResponse.data.data);
        } else {
          console.log('No bookings data from API');
          setBookings([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data from API. Please check if the Go backend is running on localhost:8080');
        setReviews([]);
        setHotels([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const hotel = hotels.find(h => h.id === review.hotelId);
    const booking = bookings.find(b => b.id === review.bookingId);
    
    const matchesSearch = review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking?.guestName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHotel = selectedHotel === "" || review.hotelId.toString() === selectedHotel;
    const matchesRating = selectedRating === "" || review.rating.toString() === selectedRating;
    const matchesStatus = selectedStatus === "" || review.status.toString() === selectedStatus;
    
    return matchesSearch && matchesHotel && matchesRating && matchesStatus;
  });

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    return status === 0 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  // Admin Functions
  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  const handleToggleStatus = async (reviewId, currentStatus) => {
    setProcessing(true);
    const newStatus = currentStatus === 0 ? 1 : 0;
    
    try {
      try {
        const response = await API.hotels.updateReviewStatus(reviewId, { status: newStatus });
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
        alert(`Review ${newStatus === 0 ? 'activated' : 'hidden'} successfully!`);
      } catch (apiError) {
        console.warn('API not available, updating locally:', apiError);
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
        alert(`Review ${newStatus === 0 ? 'activated' : 'hidden'} successfully! (Note: Go backend not running - changes are local only)`);
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Failed to update review status. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      setProcessing(true);
      try {
        try {
          await API.hotels.deleteReview(reviewId);
          setReviews(prev => prev.filter(r => r.id !== reviewId));
          alert('Review deleted successfully!');
        } catch (apiError) {
          console.warn('API not available, deleting locally:', apiError);
          setReviews(prev => prev.filter(r => r.id !== reviewId));
          alert('Review deleted successfully! (Note: Go backend not running - changes are local only)');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      } finally {
        setProcessing(false);
      }
    }
  };

  const getHotelInfo = (hotelId) => {
    return hotels.find(h => h.id === hotelId);
  };

  const getBookingInfo = (bookingId) => {
    return bookings.find(b => b.id === bookingId);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={cn(
          'text-sm',
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        )}
      />
    ));
  };

  const SkeletonCard = () => (
    <div className={cn('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'p-6')}>
      <div className={cn('flex', 'items-start', 'justify-between', 'mb-4')}>
        <div className={cn('flex-1')}>
          <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse', 'mb-2')}></div>
          <div className={cn('h-3', 'bg-gray-200', 'rounded', 'animate-pulse', 'w-3/4')}></div>
        </div>
        <div className={cn('h-6', 'w-16', 'bg-gray-200', 'rounded-full', 'animate-pulse')}></div>
      </div>
      <div className={cn('space-y-2', 'mb-4')}>
        <div className={cn('h-3', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
        <div className={cn('h-3', 'bg-gray-200', 'rounded', 'animate-pulse', 'w-5/6')}></div>
      </div>
      <div className={cn('flex', 'justify-between', 'items-center')}>
        <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse', 'w-1/3')}></div>
        <div className={cn('flex', 'gap-2')}>
          <div className={cn('h-8', 'w-8', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
          <div className={cn('h-8', 'w-8', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
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
                  <FaStar className="text-blue-600" />
                  Hotel Reviews Management
                </h1>
                <p className={cn('text-gray-600', 'mt-1')}>Manage and moderate hotel reviews and ratings</p>
              </div>
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
                <FaStar className="text-blue-600" />
                Hotel Reviews Management
              </h1>
              <p className={cn('text-gray-600', 'mt-1')}>Manage and moderate hotel reviews and ratings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
        <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6', 'mb-6')}>
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-5', 'gap-4')}>
            <div className="relative">
              <FaSearch className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
              <input
                type="text"
                placeholder="Search reviews..."
                className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
            >
              <option value="">All Hotels</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
              ))}
            </select>

            <select
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="">All Ratings</option>
              {ratings.map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>

            <select
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <button className={cn('bg-gray-100', 'text-gray-700', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-gray-200', 'transition-colors', 'flex', 'items-center', 'justify-center', 'gap-2')}>
              <FaFilter />
              More Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-5', 'gap-6', 'mb-8')}>
          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Reviews</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>{reviews.length}</p>
              </div>
              <div className={cn('bg-blue-100', 'p-3', 'rounded-full')}>
                <FaStar className={cn('text-blue-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Average Rating</p>
                <p className={cn('text-3xl', 'font-bold', 'text-yellow-600')}>
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <div className={cn('bg-yellow-100', 'p-3', 'rounded-full')}>
                <FaStar className={cn('text-yellow-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Positive</p>
                <p className={cn('text-3xl', 'font-bold', 'text-green-600')}>
                  {reviews.filter(r => r.rating >= 4).length}
                </p>
              </div>
              <div className={cn('bg-green-100', 'p-3', 'rounded-full')}>
                <FaThumbsUp className={cn('text-green-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Negative</p>
                <p className={cn('text-3xl', 'font-bold', 'text-red-600')}>
                  {reviews.filter(r => r.rating <= 2).length}
                </p>
              </div>
              <div className={cn('bg-red-100', 'p-3', 'rounded-full')}>
                <FaThumbsDown className={cn('text-red-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Verified</p>
                <p className={cn('text-3xl', 'font-bold', 'text-purple-600')}>
                  {reviews.filter(r => r.isVerified === 1).length}
                </p>
              </div>
              <div className={cn('bg-purple-100', 'p-3', 'rounded-full')}>
                <FaUser className={cn('text-purple-600', 'text-xl')} />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
          {filteredReviews.map((review) => {
            const hotel = getHotelInfo(review.hotelId);
            const booking = getBookingInfo(review.bookingId);
            
            return (
              <motion.div
                key={review.id}
                className={cn('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'overflow-hidden', 'hover:shadow-lg', 'transition-all', 'duration-300')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className={cn('flex', 'items-start', 'justify-between', 'mb-4')}>
                    <div className="flex-1">
                      <h3 className={cn('text-lg', 'font-bold', 'text-gray-900', 'mb-1')}>{review.title}</h3>
                      <p className={cn('text-sm', 'text-gray-600')}>{hotel?.name || 'Unknown Hotel'}</p>
                      <p className={cn('text-xs', 'text-gray-500')}>by {booking?.guestName || 'Unknown Guest'}</p>
                    </div>
                    <div className={cn('flex', 'flex-col', 'items-end', 'gap-2')}>
                      <div className={cn('flex', 'items-center', 'gap-1')}>
                        {renderStars(review.rating)}
                        <span className={cn('text-sm', 'font-medium', getRatingColor(review.rating))}>
                          {review.rating}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                        {review.status === 0 ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <p className={cn('text-gray-600', 'text-sm', 'mb-4', 'line-clamp-3')}>{review.comment}</p>

                  <div className={cn('flex', 'items-center', 'justify-between', 'text-xs', 'text-gray-500', 'mb-4')}>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    {review.isVerified === 1 && (
                      <span className={cn('bg-green-100', 'text-green-800', 'px-2', 'py-1', 'rounded-full')}>
                        Verified
                      </span>
                    )}
                  </div>

                  <div className={cn('flex', 'gap-2')}>
                    <button 
                      onClick={() => handleViewDetails(review)}
                      className={cn('flex-1', 'bg-blue-600', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'justify-center', 'gap-2', 'text-sm')}
                    >
                      <FaEye size={14} />
                      View Details
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(review.id, review.status)}
                      className={cn(
                        'py-2', 'px-3', 'rounded-lg', 'transition-colors',
                        review.status === 0 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      )}
                      disabled={processing}
                    >
                      {review.status === 0 ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className={cn('bg-red-500', 'text-white', 'py-2', 'px-3', 'rounded-lg', 'hover:bg-red-600', 'transition-colors')}
                      disabled={processing}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredReviews.length === 0 && (
          <div className={cn('text-center', 'py-12')}>
            <FaStar className={cn('mx-auto', 'text-gray-400', 'text-6xl', 'mb-4')} />
            <h3 className={cn('text-xl', 'font-medium', 'text-gray-900', 'mb-2')}>No reviews found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {showDetailsModal && selectedReview && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-2xl', 'w-full', 'max-h-[80vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Review Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className={cn('p-6', 'space-y-6')}>
              <div className={cn('flex', 'items-start', 'justify-between')}>
                <div className="flex-1">
                  <h4 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-2')}>{selectedReview.title}</h4>
                  <div className={cn('flex', 'items-center', 'gap-2', 'mb-2')}>
                    {renderStars(selectedReview.rating)}
                    <span className={cn('text-lg', 'font-medium', getRatingColor(selectedReview.rating))}>
                      {selectedReview.rating}/5
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedReview.status)}`}>
                  {selectedReview.status === 0 ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Hotel</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                    {getHotelInfo(selectedReview.hotelId)?.name || 'Unknown Hotel'}
                  </p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Guest</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                    {getBookingInfo(selectedReview.bookingId)?.guestName || 'Unknown Guest'}
                  </p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Booking Reference</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                    {getBookingInfo(selectedReview.bookingId)?.bookingReference || 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Verification Status</label>
                  <span className={cn(
                    'inline-flex', 'px-2', 'py-1', 'text-xs', 'font-semibold', 'rounded-full',
                    selectedReview.isVerified === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    {selectedReview.isVerified === 1 ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Created Date</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                    {new Date(selectedReview.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Last Updated</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                    {new Date(selectedReview.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Review Comment</label>
                <p className={cn('text-sm', 'text-gray-900', 'bg-gray-50', 'p-4', 'rounded-lg', 'leading-relaxed')}>
                  {selectedReview.comment}
                </p>
              </div>

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                <button
                  onClick={() => handleToggleStatus(selectedReview.id, selectedReview.status)}
                  className={cn(
                    'px-4', 'py-2', 'rounded-lg', 'transition-colors', 'flex', 'items-center', 'gap-2',
                    selectedReview.status === 0 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  )}
                  disabled={processing}
                >
                  {selectedReview.status === 0 ? <FaEyeSlash /> : <FaEye />}
                  {selectedReview.status === 0 ? 'Hide Review' : 'Show Review'}
                </button>
                <button
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  className={cn('px-4', 'py-2', 'bg-red-600', 'text-white', 'rounded-lg', 'hover:bg-red-700', 'transition-colors', 'flex', 'items-center', 'gap-2')}
                  disabled={processing}
                >
                  <FaTrash />
                  Delete Review
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
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

export default HotelReviewsManagement;