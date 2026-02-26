"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useAuth } from "@/components/AuthContext";
import CancellationModal from "@/components/CancellationModal";
import { cn } from "@/lib/utils";
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

export default function UserHelicopterBookingsPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showPerSeatCancellationModal, setShowPerSeatCancellationModal] = useState(false);

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

      // Filter only helicopter bookings (bookingType === 'helicopter')
      const helicopterBookings = data.filter(booking => booking.bookingType === 'helicopter');
      setBookings(helicopterBookings);
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

  const handleCancelSeats = (booking) => {
    setSelectedBooking(booking);
    setShowPerSeatCancellationModal(true);
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
        return <CheckCircleIcon className={cn('w-5', 'h-5', 'text-green-600')} />;
      case 'PENDING':
        return <ClockIcon className={cn('w-5', 'h-5', 'text-yellow-600')} />;
      case 'CANCELLED':
        return <XCircleIcon className={cn('w-5', 'h-5', 'text-red-600')} />;
      default:
        return <ExclamationTriangleIcon className={cn('w-5', 'h-5', 'text-gray-600')} />;
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
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('w-12', 'h-12', 'border-4', 'border-blue-500', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className={cn('text-center', 'p-8')}>
          <ExclamationTriangleIcon className={cn('w-16', 'h-16', 'text-red-500', 'mx-auto', 'mb-4')} />
          <h2 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-2')}>Error Loading Bookings</h2>
          <p className={cn('text-red-600', 'mb-4')}>{error}</p>
          <button 
            onClick={fetchMyBookings}
            className={cn('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={cn('p-6', 'lg:p-8')}>
        {/* Header */}
        <div className="mb-8">
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-2')}>
            <div className={cn('p-2', 'bg-purple-100', 'rounded-lg')}>
              <TicketIcon className={cn('w-6', 'h-6', 'text-purple-600')} />
            </div>
            <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900')}>My Helicopter Bookings</h1>
          </div>
          <p className="text-gray-600">Manage your helicopter bookings and cancellations</p>
        </div>

        {bookings.length === 0 ? (
          <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-gray-200', 'p-12', 'text-center')}>
            <TicketIcon className={cn('w-16', 'h-16', 'text-gray-300', 'mx-auto', 'mb-4')} />
            <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-2')}>No Helicopter Bookings Found</h3>
            <p className={cn('text-gray-600', 'mb-6')}>You haven't made any helicopter bookings yet. Book your first helicopter ride today!</p>
            <button 
              onClick={() => router.push('/helicopter-booking')}
              className={cn('px-6', 'py-3', 'bg-purple-600', 'text-white', 'rounded-lg', 'hover:bg-purple-700', 'transition-colors')}
            >
              Book Your First Helicopter Ride
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-gray-200', 'overflow-hidden')}>
                <div className="p-6">
                  {/* Booking Header */}
                  <div className={cn('flex', 'items-center', 'justify-between', 'mb-4')}>
                    <div className={cn('flex', 'items-center', 'gap-4')}>
                      <div className={cn('p-3', 'bg-blue-100', 'rounded-xl')}>
                        <TicketIcon className={cn('w-6', 'h-6', 'text-blue-600')} />
                      </div>
                      <div>
                        <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
                          PNR: {booking.pnr}
                        </h3>
                        <p className={cn('text-sm', 'text-gray-500')}>
                          Booking No: {booking.bookingNo || booking.id}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(booking.bookingStatus)}`}>
                      {getStatusIcon(booking.bookingStatus)}
                      <span className={cn('text-sm', 'font-medium')}>{booking.bookingStatus}</span>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4', 'mb-6')}>
                    <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-gray-50', 'rounded-lg')}>
                      <CalendarDaysIcon className={cn('w-5', 'h-5', 'text-gray-600')} />
                      <div>
                        <p className={cn('text-xs', 'text-gray-500')}>Travel Date</p>
                        <p className={cn('font-medium', 'text-gray-900')}>
                          {new Date(booking.bookDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-gray-50', 'rounded-lg')}>
                      <UserGroupIcon className={cn('w-5', 'h-5', 'text-gray-600')} />
                      <div>
                        <p className={cn('text-xs', 'text-gray-500')}>Passengers</p>
                        <p className={cn('font-medium', 'text-gray-900')}>{booking.noOfPassengers}</p>
                      </div>
                    </div>

                    <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-gray-50', 'rounded-lg')}>
                      <CurrencyRupeeIcon className={cn('w-5', 'h-5', 'text-gray-600')} />
                      <div>
                        <p className={cn('text-xs', 'text-gray-500')}>Total Fare</p>
                        <p className={cn('font-medium', 'text-gray-900')}>₹{booking.totalFare}</p>
                      </div>
                    </div>

                    <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-gray-50', 'rounded-lg')}>
                      <TicketIcon className={cn('w-5', 'h-5', 'text-gray-600')} />
                      <div>
                        <p className={cn('text-xs', 'text-gray-500')}>Seats</p>
                        <p className={cn('font-medium', 'text-gray-900')}>
                          {booking.seatLabels?.join(", ") || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Info */}
                  {booking.bookingStatus === 'CANCELLED' && (
                    <div className={cn('bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'p-4', 'mb-4')}>
                      <div className={cn('flex', 'items-start', 'gap-3')}>
                        <XCircleIcon className={cn('w-5', 'h-5', 'text-red-600', 'flex-shrink-0', 'mt-0.5')} />
                        <div>
                          <p className={cn('text-red-800', 'font-medium')}>Booking Cancelled</p>
                          {booking.cancelledAt && (
                            <p className={cn('text-red-700', 'text-sm', 'mt-1')}>
                              Cancelled on: {new Date(booking.cancelledAt).toLocaleString('en-IN')}
                            </p>
                          )}
                          {booking.refundAmount && (
                            <p className={cn('text-red-700', 'text-sm')}>
                              Refund Amount: ₹{booking.refundAmount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={cn('flex', 'items-center', 'justify-between', 'pt-4', 'border-t', 'border-gray-200')}>
                    <div className={cn('text-sm', 'text-gray-500')}>
                      Booked on: {new Date(booking.created_at || booking.bookDate).toLocaleDateString('en-IN')}
                    </div>
                    <div className={cn('flex', 'items-center', 'gap-3')}>
                      <button 
                        onClick={() => router.push(`/get-ticket?pnr=${booking.pnr}`)}
                        className={cn('px-4', 'py-2', 'text-blue-600', 'bg-blue-50', 'hover:bg-blue-100', 'rounded-lg', 'transition-colors', 'text-sm', 'font-medium')}
                      >
                        View Ticket
                      </button>
                      {canCancelBooking(booking) && (
                        <>
                          <button 
                            onClick={() => {
                              router.push(`/reschedule?pnr=${booking.pnr}&type=helicopter`);
                            }}
                            className={cn('px-4', 'py-2', 'text-orange-600', 'bg-orange-50', 'hover:bg-orange-100', 'rounded-lg', 'transition-colors', 'text-sm', 'font-medium', 'flex', 'items-center', 'gap-2')}
                          >
                            <CalendarDaysIcon className={cn('w-4', 'h-4')} />
                            Reschedule
                          </button>
                          {booking.noOfPassengers > 1 ? (
                            <>
                              <button 
                                onClick={() => handleCancelSeats(booking)}
                                className={cn('px-4', 'py-2', 'text-orange-600', 'bg-orange-50', 'hover:bg-orange-100', 'rounded-lg', 'transition-colors', 'text-sm', 'font-medium')}
                              >
                                Cancel Seats
                              </button>
                              <button 
                                onClick={() => handleCancelBooking(booking)}
                                className={cn('px-4', 'py-2', 'text-red-600', 'bg-red-50', 'hover:bg-red-100', 'rounded-lg', 'transition-colors', 'text-sm', 'font-medium')}
                              >
                                Cancel All
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleCancelBooking(booking)}
                              className={cn('px-4', 'py-2', 'text-red-600', 'bg-red-50', 'hover:bg-red-100', 'rounded-lg', 'transition-colors', 'text-sm', 'font-medium')}
                            >
                              Cancel Booking
                            </button>
                          )}
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
        bookingType="helicopter"
      />

      {/* Per-Seat Cancellation Modal */}
      <PerSeatCancellationModal
        isOpen={showPerSeatCancellationModal}
        onClose={() => {
          setShowPerSeatCancellationModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onCancellationSuccess={handleCancellationSuccess}
        bookingType="helicopter"
      />
    </div>
  );
}