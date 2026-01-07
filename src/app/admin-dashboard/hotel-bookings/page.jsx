"use client";

import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaBed,
  FaDownload,
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUser,
  FaUsers
} from "react-icons/fa";

const HotelBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    hotelId: "",
    roomType: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    childCount: 0,
    mealPlan: "EP",
    specialRequests: ""
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch bookings and hotels in parallel
        const [bookingsResponse, hotelsResponse] = await Promise.all([
          API.hotels.getBookings().catch(() => ({ data: [] })),
          API.hotels.getHotels().catch(() => ({ data: [] }))
        ]);

        // Set bookings data
        if (bookingsResponse.data && Array.isArray(bookingsResponse.data)) {
          setBookings(bookingsResponse.data);
        } else {
          // Fallback bookings data
          setBookings([
            {
              id: 1,
              bookingReference: "HTL-2024-001",
              guestName: "John Doe",
              guestEmail: "john.doe@email.com",
              guestPhone: "+91-9876543210",
              hotelName: "The Grand Mumbai",
              roomType: "Deluxe Double",
              checkInDate: "2024-12-20",
              checkOutDate: "2024-12-23",
              numberOfNights: 3,
              numberOfGuests: 2,
              childCount: 0,
              totalAmount: 15000,
              finalAmount: 15750,
              bookingStatus: "confirmed",
              paymentStatus: "completed",
              mealPlan: "CP",
              bookingDate: "2024-12-13T10:30:00Z",
              specialRequests: "Late check-in requested"
            },
            {
              id: 2,
              bookingReference: "HTL-2024-002",
              guestName: "Sarah Wilson",
              guestEmail: "sarah.wilson@email.com",
              guestPhone: "+91-9876543211",
              hotelName: "Business Inn Mumbai",
              roomType: "Standard Single",
              checkInDate: "2024-12-18",
              checkOutDate: "2024-12-20",
              numberOfNights: 2,
              numberOfGuests: 1,
              childCount: 0,
              totalAmount: 8000,
              finalAmount: 8400,
              bookingStatus: "confirmed",
              paymentStatus: "completed",
              mealPlan: "EP",
              bookingDate: "2024-12-12T14:15:00Z",
              specialRequests: ""
            },
            {
              id: 3,
              bookingReference: "HTL-2024-003",
              guestName: "Raj Patel",
              guestEmail: "raj.patel@email.com",
              guestPhone: "+91-9876543212",
              hotelName: "Royal Palace Delhi",
              roomType: "Executive Suite",
              checkInDate: "2024-12-25",
              checkOutDate: "2024-12-28",
              numberOfNights: 3,
              numberOfGuests: 4,
              childCount: 2,
              totalAmount: 45000,
              finalAmount: 47250,
              bookingStatus: "pending",
              paymentStatus: "pending",
              mealPlan: "MAP",
              bookingDate: "2024-12-13T16:45:00Z",
              specialRequests: "Airport pickup required"
            }
          ]);
        }

        // Set hotels data
        if (hotelsResponse.data && Array.isArray(hotelsResponse.data)) {
          setHotels(hotelsResponse.data);
        } else {
          // Fallback hotels data
          setHotels([
            { id: 1, name: "The Grand Mumbai" },
            { id: 2, name: "Business Inn Mumbai" },
            { id: 3, name: "Royal Palace Delhi" },
            { id: 4, name: "Beach Resort Goa" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching hotel booking data:', error);
        // Set fallback data on error
        setBookings([]);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    // Handle both snake_case (API) and camelCase (fallback) field names
    const guestName = (booking.guest_name || booking.guestName || '').toLowerCase();
    const guestEmail = (booking.guest_email || booking.guestEmail || '').toLowerCase();
    const bookingRef = (booking.booking_reference || booking.bookingReference || '').toLowerCase();
    const hotelName = (booking.hotel?.name || booking.hotelName || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = guestName.includes(searchLower) ||
                         guestEmail.includes(searchLower) ||
                         bookingRef.includes(searchLower) ||
                         hotelName.includes(searchLower);
    
    
    const bookingStatus = booking.booking_status || booking.bookingStatus;
    const matchesStatus = selectedStatus === "" || bookingStatus === selectedStatus;
    const matchesHotel = selectedHotel === "" || hotelName === selectedHotel.toLowerCase();
    
    
    const checkIn = booking.check_in_date || booking.checkInDate;
    const checkOut = booking.check_out_date || booking.checkOutDate;
    const matchesDateRange = (!dateRange.start || checkIn >= dateRange.start) &&
                            (!dateRange.end || checkOut <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesHotel && matchesDateRange;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'no_show': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'refunded': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const exportBookings = () => {
    const dataStr = JSON.stringify(filteredBookings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `hotel-bookings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Admin Functions
  const handleAddBooking = () => {
    setFormData({
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      hotelId: "",
      roomType: "",
      checkInDate: "",
      checkOutDate: "",
      numberOfGuests: 1,
      childCount: 0,
      mealPlan: "EP",
      specialRequests: ""
    });
    setShowAddModal(true);
  };

  const handleEditBooking = (booking) => {
    setFormData({
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      hotelId: booking.hotelId || "",
      roomType: booking.roomType,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      numberOfGuests: booking.numberOfGuests,
      childCount: booking.childCount,
      mealPlan: booking.mealPlan,
      specialRequests: booking.specialRequests
    });
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        await API.hotels.cancelBooking(bookingId);
        setBookings(prev => prev.map(b => 
          b.id === bookingId 
            ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' }
            : b
        ));
        alert('Booking cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      // This would be an API call to update booking status
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, bookingStatus: newStatus } : b
      ));
      alert(`Booking status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        bookingReference: `HTL-${Date.now()}`,
        bookingStatus: 'confirmed',
        paymentStatus: 'pending',
        bookingDate: new Date().toISOString(),
        numberOfNights: Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24)),
        totalAmount: 10000, // This would be calculated based on room rates
        finalAmount: 10500 // Including taxes
      };

      if (showEditModal && selectedBooking) {
        // Update existing booking
        const response = await API.hotels.updateBooking(selectedBooking.id, bookingData);
        setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, ...bookingData } : b));
        alert('Booking updated successfully!');
      } else {
        // Create new booking
        const response = await API.hotels.createBooking(bookingData);
        const newBooking = { id: Date.now(), ...bookingData };
        setBookings(prev => [...prev, newBooking]);
        alert('Booking created successfully!');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking. Please try again.');
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

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-36"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    </tr>
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
                  <FaBed className="text-blue-600" />
                  Hotel Bookings
                </h1>
                <p className="text-gray-600 mt-1">Manage hotel reservations and guest bookings</p>
              </div>
              <button 
                onClick={handleAddBooking}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <FaPlus />
                New Booking
              </button>
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
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

          {/* Table Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
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
                <FaBed className="text-blue-600" />
                Hotel Bookings
              </h1>
              <p className="text-gray-600 mt-1">Manage hotel reservations and guest bookings</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={exportBookings}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
              >
                <FaDownload />
                Export
              </button>
              <button 
                onClick={handleAddBooking}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <FaPlus />
                New Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
            </select>

            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
            >
              <option value="">All Hotels</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
              ))}
            </select>

            <input
              type="date"
              placeholder="Check-in from"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />

            <input
              type="date"
              placeholder="Check-out to"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaBed className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => (b.booking_status || b.bookingStatus) === 'confirmed').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaBed className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {bookings.filter(b => (b.booking_status || b.bookingStatus) === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaBed className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{bookings.reduce((sum, booking) => sum + (booking.final_amount || booking.finalAmount || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaBed className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <FaBed className="mx-auto text-gray-400 text-6xl mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or create a new booking.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Ref
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hotel & Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-in/out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <motion.tr 
                      key={booking.id} 
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.booking_reference || booking.bookingReference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="text-gray-500 text-xs" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{booking.guest_name || booking.guestName}</div>
                            <div className="text-sm text-gray-500">{booking.guest_email || booking.guestEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.hotel?.name || booking.hotelName}</div>
                        <div className="text-sm text-gray-500">{booking.room?.room_number || booking.roomType || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{booking.check_in_date || booking.checkInDate}</div>
                        <div className="text-gray-500">{booking.check_out_date || booking.checkOutDate}</div>
                        <div className="text-xs text-gray-400">{booking.number_of_nights || booking.numberOfNights} nights</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <FaUsers className="text-gray-400" />
                          {booking.number_of_guests || booking.numberOfGuests}
                          {(booking.child_count || booking.childCount) > 0 && (
                            <span className="text-xs text-gray-500">+{booking.child_count || booking.childCount} child</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">₹{(booking.final_amount || booking.finalAmount || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{booking.meal_plan || booking.mealPlan || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.booking_status || booking.bookingStatus)}`}>
                          {booking.booking_status || booking.bookingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.payment_status || booking.paymentStatus)}`}>
                          {booking.payment_status || booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button 
                            onClick={() => handleEditBooking(booking)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit Booking"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Booking"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Booking Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Booking Reference:</span>
                      <span className="text-sm font-medium">{selectedBooking.booking_reference || selectedBooking.bookingReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Booking Date:</span>
                      <span className="text-sm font-medium">{new Date(selectedBooking.booking_date || selectedBooking.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedBooking.booking_status || selectedBooking.bookingStatus)}`}>
                        {selectedBooking.booking_status || selectedBooking.bookingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Guest Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm font-medium">{selectedBooking.guest_name || selectedBooking.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm font-medium">{selectedBooking.guest_email || selectedBooking.guestEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm font-medium">{selectedBooking.guest_phone || selectedBooking.guestPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Stay Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Hotel:</span>
                      <span className="text-sm font-medium">{selectedBooking.hotel?.name || selectedBooking.hotelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Room Type:</span>
                      <span className="text-sm font-medium">{selectedBooking.room?.room_number || selectedBooking.roomType || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Check-in:</span>
                      <span className="text-sm font-medium">{selectedBooking.check_in_date || selectedBooking.checkInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Check-out:</span>
                      <span className="text-sm font-medium">{selectedBooking.check_out_date || selectedBooking.checkOutDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Nights:</span>
                      <span className="text-sm font-medium">{selectedBooking.number_of_nights || selectedBooking.numberOfNights}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Amount:</span>
                      <span className="text-sm font-medium">₹{(selectedBooking.total_amount || selectedBooking.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Final Amount:</span>
                      <span className="text-sm font-bold text-green-600">₹{(selectedBooking.final_amount || selectedBooking.finalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedBooking.payment_status || selectedBooking.paymentStatus)}`}>
                        {selectedBooking.payment_status || selectedBooking.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Meal Plan:</span>
                      <span className="text-sm font-medium">{selectedBooking.meal_plan || selectedBooking.mealPlan || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Special Requests</h4>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedBooking.special_requests || selectedBooking.specialRequests}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => handleEditBooking(selectedBooking)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Booking
                </button>
                <button
                  onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'completed')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Booking Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showEditModal ? 'Edit Booking' : 'New Booking'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedBooking(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter guest name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Email *</label>
                  <input
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="guest@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Phone *</label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel *</label>
                  <select
                    name="hotelId"
                    value={formData.hotelId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                  <input
                    type="text"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Deluxe Double"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
                  <select
                    name="mealPlan"
                    value={formData.mealPlan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EP">EP - European Plan (Room Only)</option>
                    <option value="CP">CP - Continental Plan (Breakfast)</option>
                    <option value="MAP">MAP - Modified American Plan (Breakfast + Dinner)</option>
                    <option value="AP">AP - American Plan (All Meals)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                  <input
                    type="number"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Children (5-12 years)</label>
                  <input
                    type="number"
                    name="childCount"
                    value={formData.childCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special requests or requirements"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {showEditModal ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    showEditModal ? 'Update Booking' : 'Create Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelBookings;