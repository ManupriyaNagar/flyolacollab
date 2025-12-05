"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useAuth } from "@/components/AuthContext";
import CancellationModal from "@/components/CancellationModal";
import {
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    CurrencyRupeeIcon,
    ExclamationTriangleIcon,
    TicketIcon,
    UserGroupIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserBookingsPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  useEffect(() => {
    if (!authState.isLoading && !authState.isLoggedIn) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn) return;
    fetchMyBookings();
  }, [authState]);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please sign in again.");

      const res = await fetch(`${BASE_URL}/bookings/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: Failed to fetch bookings`);
      }

      // Filter only flight bookings (bookingType !== 'helicopter')
      const flightBookings = data.filter(booking => booking.bookingType !== 'helicopter');
      setBookings(flightBookings);
    } catch (err) {
      setError(err.message === "Unauthorized: No valid user token provided"
        ? "Please sign in again to view your bookings."
        : `Could not load bookings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancellationModal(true);
  };

  const handleCancellationSuccess = (cancellationData) => {
    // Update the booking status in the local state
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === cancellationData.bookingId 
          ? { ...booking, bookingStatus: 'CANCELLED' }
          : booking
      )
    );
    toast.success('Booking cancelled successfully');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'SUCCESS':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'CANCELLED':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canCancelBooking = (booking) => {
    if (booking.bookingStatus === 'CANCELLED') return false;
    if (booking.bookingStatus !== 'CONFIRMED' && booking.bookingStatus !== 'SUCCESS') return false;
    
    // Check if booking date hasn't passed
    const bookingDate = new Date(booking.bookDate);
    const today = new Date();
    return bookingDate > today;
  };

  if (authState.isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bookings</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchMyBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TicketIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <p className="text-gray-600">Manage your flight bookings and cancellations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flight Bookings Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any flight bookings yet. Start your journey today!</p>
            <button 
              onClick={() => router.push('/scheduled-flight')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Your First Flight
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Booking Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <TicketIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          PNR: {booking.pnr}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Booking No: {booking.bookingNo || booking.id}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(booking.bookingStatus)}`}>
                      {getStatusIcon(booking.bookingStatus)}
                      <span className="text-sm font-medium">{booking.bookingStatus}</span>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CalendarDaysIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Travel Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.bookDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <UserGroupIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Passengers</p>
                        <p className="font-medium text-gray-900">{booking.noOfPassengers}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CurrencyRupeeIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Total Fare</p>
                        <p className="font-medium text-gray-900">₹{booking.totalFare}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <TicketIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Seats</p>
                        <p className="font-medium text-gray-900">
                          {booking.seatLabels?.join(", ") || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Info */}
                  {booking.bookingStatus === 'CANCELLED' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-800 font-medium">Booking Cancelled</p>
                          {booking.cancelledAt && (
                            <p className="text-red-700 text-sm mt-1">
                              Cancelled on: {new Date(booking.cancelledAt).toLocaleString('en-IN')}
                            </p>
                          )}
                          {booking.refundAmount && (
                            <p className="text-red-700 text-sm">
                              Refund Amount: ₹{booking.refundAmount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Booked on: {new Date(booking.created_at || booking.bookDate).toLocaleDateString('en-IN')}
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => router.push(`/get-ticket?pnr=${booking.pnr}`)}
                        className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                      >
                        View Ticket
                      </button>
                      {canCancelBooking(booking) && (
                        <>
                          <button 
                            onClick={() => {
                              router.push(`/reschedule?bookingId=${booking.id}&pnr=${booking.pnr}&type=flight`);
                            }}
                            className="px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <CalendarDaysIcon className="w-4 h-4" />
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleCancelBooking(booking)}
                            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                          >
                            Cancel Booking
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancellationModal}
        onClose={() => {
          setShowCancellationModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onCancellationSuccess={handleCancellationSuccess}
      />
    </div>
  );
}