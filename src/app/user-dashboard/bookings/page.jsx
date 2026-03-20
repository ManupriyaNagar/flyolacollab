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
  XCircleIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PerSeatCancellationModal from "../../../components/PerSeatCancellationModal";
import { motion, AnimatePresence } from "framer-motion";

export default function UserBookingsPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showPerSeatCancellationModal, setShowPerSeatCancellationModal] = useState(false);

  // New UI states
  const [activeTab, setActiveTab] = useState('UPCOMING'); // 'UPCOMING', 'CANCELLED', 'COMPLETED'
  const [searchTerm, setSearchTerm] = useState("");

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

  const getBgImage = () => {
    switch (activeTab) {
      case "UPCOMING":
        return "/flights/upcoming.svg";
      case "CANCELLED":
        return "/flights/cancelled.svg";
      case "COMPLETED":
        return "/flights/completed.svg";
      default:
        return "/flights/upcoming.svg";
    }
  };


  const emptyStateConfig = {
    UPCOMING: {
      icon: "/flights/upcoming-icon1.svg",
      title: "No trips yet",
      subtitle: "Your itinerary will appear here.",
    },
    CANCELLED: {
      icon: "/flights/cancelled-icon1.svg",
      title: "No cancellations here",
      subtitle: "No cancellations on record.",
    },
    COMPLETED: {
      icon: "/flights/completed-icon1.svg",
      title: "No completed trips yet",
      subtitle: "Our past bookings will appear here once a trip is done.",
    },
  };

  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Filter by tab
    if (activeTab === 'UPCOMING') {
      result = result.filter(b => (b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'SUCCESS' || b.bookingStatus === 'PENDING') && new Date(b.bookDate) >= new Date());
    } else if (activeTab === 'CANCELLED') {
      result = result.filter(b => b.bookingStatus === 'CANCELLED');
    } else if (activeTab === 'COMPLETED') {
      result = result.filter(b => (b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'SUCCESS') && new Date(b.bookDate) < new Date());
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b =>
        (b.pnr && b.pnr.toLowerCase().includes(term)) ||
        (b.bookingNo && b.bookingNo.toString().toLowerCase().includes(term)) ||
        (b.seatLabels && b.seatLabels.join(", ").toLowerCase().includes(term))
      );
    }

    return result;
  }, [bookings, activeTab, searchTerm]);

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancellationModal(true);
  };

  const handleCancelSeats = (booking) => {
    setSelectedBooking(booking);
    setShowPerSeatCancellationModal(true);
  };

  const handleCancellationSuccess = (cancellationData) => {
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
      <div className={cn('min-h-screen', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('w-12', 'h-12', 'border-4', 'border-blue-600', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen')}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Blue Header Section */}
      <div className="relative h-64 overflow-hidden bg-blue-600/90 rounded-2xl mx-4 sm:mx-6 mt-4">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 transform scale-105"
          style={{
            backgroundImage: `url(${getBgImage()})`,
          }}
        />
        {/* Dark overlay for better button/input contrast */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" /> */}

        <div className="relative h-full px-4 sm:px-6 pt-6 sm:pt-10 flex flex-col items-end justify-center -mt-10">
          {/* Search Bar */}
          <div className="flex items-center gap-0 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden w-full max-w-md shadow-2xl border border-white/20">
            <div className="flex-1 flex items-center px-4 py-2.5 sm:py-3">
              <input
                type="text"
                placeholder="Search for a booking"
                className="bg-transparent border-none outline-none w-full text-gray-700 placeholder:text-gray-400 font-medium text-xs sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#ff9533] hover:bg-[#ff8000] p-3 sm:p-4 text-white transition-all flex items-center justify-center">
              <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 pb-12 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 bg-[#fafbfc] px-2 sm:px-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'UPCOMING', label: 'UPCOMING', icon: BriefcaseIcon },
              { id: 'CANCELLED', label: 'CANCELLED', icon: NoSymbolIcon },
              { id: 'COMPLETED', label: 'COMPLETED', icon: CheckCircleIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold tracking-wider transition-all relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-[#0052cc]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                <tab.icon className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 shrink-0",
                  activeTab === tab.id
                    ? (tab.id === 'CANCELLED' ? "text-red-500" : tab.id === 'COMPLETED' ? "text-green-500" : "text-[#0052cc]")
                    : "text-gray-400"
                )} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0052cc]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredBookings.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col md:flex-row items-center justify-between bg-white py-10 sm:py-12 px-6"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                    <img src={emptyStateConfig[activeTab].icon} alt="" className="h-auto w-12 sm:w-16" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-1">{emptyStateConfig[activeTab].title}</h3>
                      <p className="text-sm sm:text-base text-gray-500 font-medium">{emptyStateConfig[activeTab].subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/scheduled-flight')}
                    className="mt-6 md:mt-0 px-8 sm:px-10 py-3 sm:py-4 bg-[#ff9533] hover:bg-[#ff8000] text-white font-medium rounded-lg transition-all active:scale-95"
                  >
                    Plan a trip
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className={cn('bg-white', 'rounded-2xl', 'border', 'border-gray-100', 'overflow-hidden')}>
                      <div className="p-6">
                        {/* Booking Header */}
                        <div className={cn('flex', 'items-center', 'justify-between', 'mb-6')}>
                          <div className={cn('flex', 'items-center', 'gap-4')}>
                            <div className={cn('p-3', 'bg-blue-50', 'rounded-xl')}>
                              <TicketIcon className={cn('w-6', 'h-6', 'text-blue-600')} />
                            </div>
                            <div>
                              <h3 className={cn('text-lg', 'font-bold', 'text-gray-900')}>
                                PNR: {booking.pnr}
                              </h3>
                              <p className={cn('text-xs', 'text-gray-500', 'font-medium', 'mt-0.5')}>
                                Booking No: {booking.bookingNo || booking.id}
                              </p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${getStatusColor(booking.bookingStatus)} whitespace-nowrap`}>
                            {getStatusIcon(booking.bookingStatus)}
                            <span>{booking.bookingStatus}</span>
                          </div>
                        </div>

                        {/* Booking Details Grid */}
                        <div className={cn('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-3 sm:gap-4', 'mb-6')}>
                          <div className={cn('flex', 'items-center', 'gap-2 sm:gap-3', 'p-3 sm:p-4', 'bg-[#f8faff]', 'rounded-xl')}>
                            <CalendarDaysIcon className={cn('w-4 h-4 sm:w-5 sm:h-5', 'text-blue-500')} />
                            <div>
                              <p className={cn('text-[9px] sm:text-[10px]', 'text-gray-400', 'uppercase', 'tracking-wider', 'font-bold')}>Travel Date</p>
                              <p className={cn('font-bold', 'text-gray-900', 'text-xs sm:text-sm')}>
                                {new Date(booking.bookDate).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className={cn('flex', 'items-center', 'gap-2 sm:gap-3', 'p-3 sm:p-4', 'bg-[#f8faff]', 'rounded-xl')}>
                            <UserGroupIcon className={cn('w-4 h-4 sm:w-5 sm:h-5', 'text-blue-500')} />
                            <div>
                              <p className={cn('text-[9px] sm:text-[10px]', 'text-gray-400', 'uppercase', 'tracking-wider', 'font-bold')}>Passengers</p>
                              <p className={cn('font-bold', 'text-gray-900', 'text-xs sm:text-sm')}>{booking.noOfPassengers}</p>
                            </div>
                          </div>

                          <div className={cn('flex', 'items-center', 'gap-2 sm:gap-3', 'p-3 sm:p-4', 'bg-[#f8faff]', 'rounded-xl')}>
                            <CurrencyRupeeIcon className={cn('w-4 h-4 sm:w-5 sm:h-5', 'text-blue-500')} />
                            <div>
                              <p className={cn('text-[9px] sm:text-[10px]', 'text-gray-400', 'uppercase', 'tracking-wider', 'font-bold')}>Total Fare</p>
                              <p className={cn('font-bold', 'text-gray-900', 'text-xs sm:text-sm')}>₹{booking.totalFare}</p>
                            </div>
                          </div>

                          <div className={cn('flex', 'items-center', 'gap-2 sm:gap-3', 'p-3 sm:p-4', 'bg-[#f8faff]', 'rounded-xl')}>
                            <TicketIcon className={cn('w-4 h-4 sm:w-5 sm:h-5', 'text-blue-500')} />
                            <div>
                              <p className={cn('text-[9px] sm:text-[10px]', 'text-gray-400', 'uppercase', 'tracking-wider', 'font-bold')}>Seats</p>
                              <p className={cn('font-bold', 'text-gray-900', 'text-xs sm:text-sm')}>
                                {booking.seatLabels?.join(", ") || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Cancellation Info */}
                        {booking.bookingStatus === 'CANCELLED' && (
                          <div className={cn('bg-red-50', 'border', 'border-red-100', 'rounded-xl', 'p-4', 'mb-6')}>
                            <div className={cn('flex', 'items-start', 'gap-3')}>
                              <XCircleIcon className={cn('w-5', 'h-5', 'text-red-500', 'flex-shrink-0', 'mt-0.5')} />
                              <div>
                                <p className={cn('text-red-700', 'font-bold', 'text-sm')}>Booking Cancelled</p>
                                {booking.cancelledAt && (
                                  <p className={cn('text-red-600/70', 'text-xs', 'mt-0.5', 'font-medium')}>
                                    Cancelled on: {new Date(booking.cancelledAt).toLocaleString('en-IN')}
                                  </p>
                                )}
                                {booking.refundAmount && (
                                  <p className={cn('text-red-700', 'text-sm', 'font-bold', 'mt-1')}>
                                    Refund Amount: ₹{booking.refundAmount}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className={cn('flex', 'flex-col', 'sm:flex-row', 'items-center', 'justify-between', 'gap-4', 'pt-5', 'border-t', 'border-gray-50')}>
                          <div className={cn('text-xs', 'text-gray-400', 'font-medium')}>
                            Booked on: {new Date(booking.created_at || booking.bookDate).toLocaleDateString('en-IN')}
                          </div>
                          <div className={cn('flex', 'flex-wrap', 'items-center', 'justify-center', 'gap-3')}>
                            <button
                              onClick={() => router.push(`/get-ticket?pnr=${booking.pnr}`)}
                              className={cn('px-5', 'py-2', 'text-[#0052cc]', 'bg-[#0052cc]/5', 'hover:bg-[#0052cc]/10', 'rounded-lg', 'transition-colors', 'text-sm', 'font-bold')}
                            >
                              View Ticket
                            </button>
                            {canCancelBooking(booking) && (
                              <>
                                <button
                                  onClick={() => {
                                    router.push(`/reschedule?pnr=${booking.pnr}&type=flight`);
                                  }}
                                  className={cn('px-5', 'py-2', 'text-[#ff9533]', 'bg-[#ff9533]/5', 'hover:bg-[#ff9533]/10', 'rounded-lg', 'transition-colors', 'text-sm', 'font-bold', 'flex', 'items-center', 'gap-2')}
                                >
                                  <CalendarDaysIcon className={cn('w-4', 'h-4')} />
                                  Reschedule
                                </button>
                                {booking.noOfPassengers > 1 ? (
                                  <>
                                    <button
                                      onClick={() => handleCancelSeats(booking)}
                                      className={cn('px-5', 'py-2', 'text-[#ff9533]', 'bg-[#ff9533]/5', 'hover:bg-[#ff9533]/10', 'rounded-lg', 'transition-colors', 'text-sm', 'font-bold')}
                                    >
                                      Cancel Seats
                                    </button>
                                    <button
                                      onClick={() => handleCancelBooking(booking)}
                                      className={cn('px-5', 'py-2', 'text-red-500', 'bg-red-50', 'hover:bg-red-100', 'rounded-lg', 'transition-colors', 'text-sm', 'font-bold')}
                                    >
                                      Cancel All
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleCancelBooking(booking)}
                                    className={cn('px-5', 'py-2', 'text-red-500', 'bg-red-50', 'hover:bg-red-100', 'rounded-lg', 'transition-colors', 'text-sm', 'font-bold')}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cancellation Modals */}
      <CancellationModal
        isOpen={showCancellationModal}
        onClose={() => {
          setShowCancellationModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onCancellationSuccess={handleCancellationSuccess}
        bookingType="flight"
      />

      <PerSeatCancellationModal
        isOpen={showPerSeatCancellationModal}
        onClose={() => {
          setShowPerSeatCancellationModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onCancellationSuccess={handleCancellationSuccess}
        bookingType="flight"
      />
    </div >
  );
}