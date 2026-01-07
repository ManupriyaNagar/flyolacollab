"use client";

import { useAuth } from "@/components/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FaBed,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaDownload,
    FaEye,
    FaHotel,
    FaTimesCircle
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function HotelBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, upcoming, past, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { authState } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, [authState.user?.email]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Get logged-in user's email
      const userEmail = authState.user?.email;
      
      if (!userEmail) {
        toast.error("Please log in to view your bookings");
        setBookings([]);
        return;
      }
      
      // Fetch bookings filtered by user's email
      const response = await API.hotels.getBookings({ email: userEmail });
      
      if (response.data && Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadBookingDetails = (booking) => {
    try {
      const hotelName = booking.hotel?.name || booking.hotelName || "Hotel";
      const checkIn = booking.check_in_date || booking.checkInDate;
      const checkOut = booking.check_out_date || booking.checkOutDate;
      const status = booking.booking_status || booking.bookingStatus;
      const bookingRef = booking.booking_reference || booking.bookingReference;
      const guestName = booking.guest_name || booking.guestName;
      const guestEmail = booking.guest_email || booking.guestEmail;
      const guestPhone = booking.guest_phone || booking.guestPhone;
      const nights = booking.number_of_nights || booking.numberOfNights || 1;
      const guests = booking.number_of_guests || booking.numberOfGuests || 1;
      const roomNumber = booking.room?.room_number || booking.roomType || 'N/A';
      const roomCategory = booking.room?.category?.name || 'Standard';
      const totalAmount = booking.total_amount || booking.totalAmount || 0;
      const taxAmount = booking.tax_amount || booking.taxAmount || 0;
      const finalAmount = booking.final_amount || booking.finalAmount || 0;
      const specialRequests = booking.special_requests || booking.specialRequests || 'None';
      const bookingDate = booking.booking_date || booking.createdAt;

      // Create detailed booking information
      const bookingDetails = `
╔════════════════════════════════════════════════════════════════╗
║                    HOTEL BOOKING DETAILS                       ║
╚════════════════════════════════════════════════════════════════╝

BOOKING INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking Reference:    ${bookingRef}
Booking Date:         ${formatDate(bookingDate)}
Status:               ${status.toUpperCase()}

HOTEL INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hotel Name:           ${hotelName}
Room Number:          ${roomNumber}
Room Category:        ${roomCategory}

GUEST INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:                 ${guestName}
Email:                ${guestEmail}
Phone:                ${guestPhone}
Number of Guests:     ${guests}

CHECK-IN & CHECK-OUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Check-in Date:        ${formatDate(checkIn)}
Check-out Date:       ${formatDate(checkOut)}
Number of Nights:     ${nights}

PAYMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Room Charges:         ₹${totalAmount.toLocaleString()}
Taxes & Fees:         ₹${taxAmount.toLocaleString()}
Total Amount:         ₹${finalAmount.toLocaleString()}

SPECIAL REQUESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${specialRequests}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated on: ${new Date().toLocaleString()}
Flyola - Premium Aviation Services
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim();

      // Create and download the file
      const blob = new Blob([bookingDetails], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Booking_${bookingRef}_${hotelName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Booking details downloaded successfully!");
    } catch (error) {
      console.error("Error downloading booking details:", error);
      toast.error("Failed to download booking details");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <FaCheckCircle className="w-4 h-4" />;
      case "pending":
        return <FaClock className="w-4 h-4" />;
      case "cancelled":
        return <FaTimesCircle className="w-4 h-4" />;
      case "completed":
        return <FaCheckCircle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isUpcoming = (checkInDate) => {
    return new Date(checkInDate) > new Date();
  };

  const isPast = (checkOutDate) => {
    return new Date(checkOutDate) < new Date();
  };

  const filteredBookings = bookings.filter((booking) => {
    const checkIn = booking.check_in_date || booking.checkInDate;
    const checkOut = booking.check_out_date || booking.checkOutDate;
    const status = booking.booking_status || booking.bookingStatus;

    switch (filter) {
      case "upcoming":
        return isUpcoming(checkIn) && status !== "cancelled";
      case "past":
        return isPast(checkOut);
      case "cancelled":
        return status === "cancelled";
      default:
        return true;
    }
  });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(
      (b) =>
        isUpcoming(b.check_in_date || b.checkInDate) &&
        (b.booking_status || b.bookingStatus) !== "cancelled"
    ).length,
    past: bookings.filter((b) =>
      isPast(b.check_out_date || b.checkOutDate)
    ).length,
    cancelled: bookings.filter(
      (b) => (b.booking_status || b.bookingStatus) === "cancelled"
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your hotel bookings...</p>
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
                My Hotel Bookings
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your hotel reservations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              filter === "all" && "ring-2 ring-blue-500"
            )}
            onClick={() => setFilter("all")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-blue-100 p-2.5 rounded-lg">
                  <FaBed className="text-blue-600 text-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              filter === "upcoming" && "ring-2 ring-green-500"
            )}
            onClick={() => setFilter("upcoming")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.upcoming}
                  </p>
                </div>
                <div className="bg-green-100 p-2.5 rounded-lg">
                  <FaCalendarAlt className="text-green-600 text-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              filter === "past" && "ring-2 ring-purple-500"
            )}
            onClick={() => setFilter("past")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Past Stays
                  </p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {stats.past}
                  </p>
                </div>
                <div className="bg-purple-100 p-2.5 rounded-lg">
                  <FaCheckCircle className="text-purple-600 text-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              filter === "cancelled" && "ring-2 ring-red-500"
            )}
            onClick={() => setFilter("cancelled")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {stats.cancelled}
                  </p>
                </div>
                <div className="bg-red-100 p-2.5 rounded-lg">
                  <FaTimesCircle className="text-red-600 text-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FaBed className="mx-auto text-gray-400 text-6xl mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "You haven't made any hotel bookings yet."
                  : `No ${filter} bookings found.`}
              </p>
              <Link
                href="/hotels"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaHotel className="mr-2" />
                Browse Hotels
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const hotelName =
                booking.hotel?.name || booking.hotelName || "Hotel";
              const checkIn = booking.check_in_date || booking.checkInDate;
              const checkOut = booking.check_out_date || booking.checkOutDate;
              const status = booking.booking_status || booking.bookingStatus;
              const bookingRef =
                booking.booking_reference || booking.bookingReference;
              const guestName = booking.guest_name || booking.guestName;
              const nights =
                booking.number_of_nights || booking.numberOfNights || 1;
              const finalAmount =
                booking.final_amount || booking.finalAmount || 0;
              const roomNumber = booking.room?.room_number || booking.roomType || 'N/A';

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Hotel Image Placeholder */}
                        <div className="w-full md:w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaHotel className="text-white text-4xl" />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {hotelName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Booking Ref: {bookingRef}
                              </p>
                              <p className="text-sm text-gray-600">
                                Room: {roomNumber}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border",
                                getStatusColor(status)
                              )}
                            >
                              {getStatusIcon(status)}
                              <span className="capitalize">{status}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <FaCalendarAlt className="text-gray-400" />
                              <div>
                                <p className="text-gray-600">Check-in</p>
                                <p className="font-semibold">
                                  {formatDate(checkIn)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FaCalendarAlt className="text-gray-400" />
                              <div>
                                <p className="text-gray-600">Check-out</p>
                                <p className="font-semibold">
                                  {formatDate(checkOut)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FaBed className="text-gray-400" />
                              <div>
                                <p className="text-gray-600">Duration</p>
                                <p className="font-semibold">{nights} Night(s)</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Amount
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                ₹{finalAmount.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <FaEye className="mr-2" />
                                View Details
                              </button>
                              <button 
                                onClick={() => downloadBookingDetails(booking)}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <FaDownload className="mr-2" />
                                Download Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking Details
                </h3>
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
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Booking Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Booking Reference:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedBooking.booking_reference ||
                          selectedBooking.bookingReference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span
                        className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full border",
                          getStatusColor(
                            selectedBooking.booking_status ||
                              selectedBooking.bookingStatus
                          )
                        )}
                      >
                        {selectedBooking.booking_status ||
                          selectedBooking.bookingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Guest Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm font-medium">
                        {selectedBooking.guest_name ||
                          selectedBooking.guestName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm font-medium">
                        {selectedBooking.guest_email ||
                          selectedBooking.guestEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm font-medium">
                        {selectedBooking.guest_phone ||
                          selectedBooking.guestPhone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Payment Summary
                </h4>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room Charges:</span>
                    <span className="font-medium">
                      ₹
                      {(
                        selectedBooking.total_amount ||
                        selectedBooking.totalAmount ||
                        0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees:</span>
                    <span className="font-medium">
                      ₹
                      {(
                        selectedBooking.tax_amount ||
                        selectedBooking.taxAmount ||
                        0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹
                      {(
                        selectedBooking.final_amount ||
                        selectedBooking.finalAmount ||
                        0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedBooking.special_requests ||
              selectedBooking.specialRequests ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </h4>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.special_requests ||
                      selectedBooking.specialRequests}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => downloadBookingDetails(selectedBooking)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaDownload />
                Download Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
