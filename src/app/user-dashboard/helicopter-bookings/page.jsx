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

export default function UserHelicopterBookingsPage() {
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
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };

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
        (b.seatLabels && b.seatLabels.join(", ").toLowerCase().includes(term)) ||
        (b.from && b.from.toLowerCase().includes(term)) ||
        (b.to && b.to.toLowerCase().includes(term))
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
      {/* Header Section */}
      <div className="relative h-64 overflow-hidden bg-blue-600/90 rounded-2xl mx-6 mt-4">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 transform scale-105"
          style={{
            backgroundImage: `url(${getBgImage()})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

        <div className="relative h-full px-6 pt-10 flex flex-col items-end justify-center">
          {/* Search Bar */}
          <div className="flex items-center gap-0 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden w-full max-w-md shadow-2xl">
            <div className="flex-1 flex items-center px-4 py-3 bg-[#f0f3f8]">
              <input
                type="text"
                placeholder="Search for a helicopter booking"
                className="bg-transparent border-none outline-none w-full text-gray-700 placeholder:text-gray-400 font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#ff9533] hover:bg-[#ff8000] p-4 text-white transition-all flex items-center justify-center">
              <MagnifyingGlassIcon className="w-6 h-6 stroke-[2.5px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 pb-12">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-xl ">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 bg-[#fafbfc] px-4 z-4">
            {[
              { id: 'UPCOMING', label: 'UPCOMING', icon: BriefcaseIcon },
              { id: 'CANCELLED', label: 'CANCELLED', icon: NoSymbolIcon },
              { id: 'COMPLETED', label: 'COMPLETED', icon: CheckCircleIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-8 py-5 text-sm font-bold tracking-wider transition-all relative z-4",
                  activeTab === tab.id
                    ? "text-[#0052cc]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                <tab.icon className={cn(
                  "w-6 h-6 shrink-0",
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
                  className="flex flex-col md:flex-row items-center justify-between bg-white py-12 px-6"
                >
                  <div className="flex items-center gap-6">
                    <img src={emptyStateConfig[activeTab].icon} alt="" className="h-auto w-16" />
                    <div>
                      <h3 className="text-2xl font-medium text-gray-900 mb-1">{emptyStateConfig[activeTab].title}</h3>
                      <p className="text-gray-500 font-medium">{emptyStateConfig[activeTab].subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/helicopter-booking')}
                    className="mt-8 md:mt-0 px-10 py-4 bg-[#ff9533] hover:bg-[#ff8000] text-white font-medium rounded-lg transition-all active:scale-95 shadow-lg shadow-orange-100"
                  >
                    Plan a trip
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 space-y-6 flex flex-col items-center"
                >
                  {filteredBookings.map((booking) => {
                    const isExpanded = expandedBookingId === booking.id;
                    const travelDate = new Date(booking.bookDate);
                    const formattedDate = travelDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', weekday: 'short' });

                    return (
                      <div key={booking.id} className={cn('bg-white', 'rounded-2xl', 'border', 'border-gray-100', 'overflow-hidden', 'w-full', 'max-w-4xl', 'shadow-sm', 'transition-all', isExpanded && 'ring-2 ring-blue-50')}>
                        <div className="p-6">
                          {/* Collapsed Header View */}
                          <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
                              <div className="flex flex-col gap-1 min-w-[120px]">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-sm flex items-center">
                                    <img src="/flights/Layer_1.png" alt="" className="w-full h-full object-contain" />
                                  </div>
                                  <span className="font-bold text-gray-900 text-sm">Flyola Heli</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{booking.flightNo || "HELI-P1"}</span>
                                  <span className="bg-[#10d48f]/10 text-[#10d48f] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    {booking.cabinClass || "Premium"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 flex items-center justify-center px-4 w-full">
                                <div className="flex items-center justify-between w-full max-w-sm">
                                  <div className="text-left">
                                    <p className="text-xl font-black text-gray-900 leading-tight">00:00</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">{booking.from || "BHO"}</p>
                                    <p className="text-[9px] font-black text-gray-300">{formattedDate}</p>
                                  </div>

                                  <div className="flex-1 flex flex-col items-center gap-1 group px-4">
                                    <div className="w-full flex items-center gap-0">
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                      <div className="flex-1 border-t border-dashed border-gray-300 relative">
                                        <div className="absolute left-1/2 -top-2.5 -translate-x-1/2 text-gray-300 bg-white px-2">
                                          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                          </svg>
                                        </div>
                                      </div>
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                      Charter <span className="w-1 h-1 rounded-full bg-gray-300" /> {booking.seatLabels?.length || 1} Seat(s)
                                    </p>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-xl font-black text-gray-900 leading-tight">00:00</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">{booking.to || "TBD"}</p>
                                    <p className="text-[9px] font-black text-gray-300">{formattedDate}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 border-l pl-6 border-gray-50">
                              <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", getStatusColor(booking.bookingStatus))}>
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                {booking.bookingStatus}
                              </div>
                              <button
                                onClick={() => toggleExpand(booking.id)}
                                className="flex items-center gap-1 text-[#00a6ff] text-xs font-black transition-colors hover:text-[#0088dd] bg-blue-50/50 px-3 py-1.5 rounded-lg"
                              >
                                Details
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRightIcon className="w-3.5 h-3.5 rotate-90" />
                                </motion.div>
                              </button>
                            </div>
                          </div>

                          {/* Expanded View */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-10">
                                  {/* Heli Details Block */}
                                  <div className="flex flex-col gap-4">
                                    <h4 className="text-sm font-black text-gray-900 border-l-4 border-blue-500 pl-3">Helicopter Details</h4>
                                    <div className="flex flex-col border border-dashed border-gray-300 rounded-3xl p-8 bg-[#fcfdfe]">
                                      <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center p-2 bg-white shadow-sm">
                                          <img src="/flights/Layer_1.png" alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-xl font-black text-gray-900">Flyola Private Charter</span>
                                      </div>

                                      <div className="flex items-center justify-between gap-8">
                                        <div className="text-left">
                                          <p className="text-3xl font-black text-gray-900 leading-none mb-2">00:00</p>
                                          <p className="text-sm font-black text-gray-500 uppercase">{booking.from || "ORIGIN"}</p>
                                          <p className="text-[10px] font-black text-gray-300">{formattedDate}</p>
                                        </div>

                                        <div className="flex-1 flex flex-col items-center gap-2">
                                          <div className="w-full flex items-center gap-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                            <div className="flex-1 border-t border-dashed border-gray-300 relative">
                                              <div className="absolute left-1/2 -top-3 -translate-x-1/2 text-gray-400 bg-white px-2">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                                </svg>
                                              </div>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                          </div>
                                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Charter Mode</p>
                                        </div>

                                        <div className="text-right">
                                          <p className="text-3xl font-black text-gray-900 leading-none mb-2">00:00</p>
                                          <p className="text-sm font-black text-gray-500 uppercase">{booking.to || "DESTINATION"}</p>
                                          <p className="text-[10px] font-black text-gray-300">{formattedDate}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Travellers Details Block */}
                                  <div className="flex flex-col gap-4">
                                    <h4 className="text-sm font-black text-gray-900 border-l-4 border-orange-400 pl-3">Travellers Details</h4>
                                    <div className="border border-dashed border-gray-200 rounded-3xl overflow-hidden p-6 bg-white">
                                      <div className="grid grid-cols-3 gap-4 px-6 mb-4">
                                        <span className="text-[10px] font-black text-gray-300 uppercase">Passenger Name</span>
                                        <span className="text-[10px] font-black text-gray-300 uppercase text-center">Declared Weight</span>
                                        <span className="text-[10px] font-black text-gray-300 uppercase text-right">Seat Label</span>
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        {(booking.passengers || [
                                          { name: "Primary Traveller", weight: booking.weight || "-", seat: booking.seatLabels?.[0] || "TBD" }
                                        ]).map((p, idx) => (
                                          <div key={idx} className="bg-[#f8faff] rounded-2xl px-6 py-4 flex items-center justify-between group transition-all hover:bg-blue-50">
                                            <div className="flex items-center gap-2 w-1/3">
                                              <span className="text-xs font-black text-gray-900">{idx + 1}. {p.name || `Passenger ${idx + 1}`}</span>
                                            </div>
                                            <div className="w-1/3 flex items-center justify-center">
                                              <div className="flex flex-1 items-center gap-4">
                                                <div className="flex-1 border-t border-dashed border-gray-200" />
                                                {p.weight && p.weight !== "-" ? (
                                                  <div className="bg-[#ff9533] text-white text-[9px] font-black px-2.5 py-1.5 rounded-full min-w-[45px] text-center shadow-md shadow-orange-100">
                                                    {p.weight} kg
                                                  </div>
                                                ) : (
                                                  <div className="w-2 h-2 rounded-full bg-gray-200" />
                                                )}
                                                <div className="flex-1 border-t border-dashed border-gray-200" />
                                              </div>
                                            </div>
                                            <div className="w-1/3 flex items-center justify-end gap-2">
                                              <div className="w-5 h-5 flex items-center justify-center opacity-60">
                                                <img src="/flights/Group3.svg" alt="" className="w-full h-full object-contain" />
                                              </div>
                                              <span className="text-sm font-black text-gray-900 uppercase">{p.seat}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Booking Details Block */}
                                  <div className="flex flex-col gap-4">
                                    <h4 className="text-sm font-black text-gray-900 border-l-4 border-gray-400 pl-3">Booking Metadata</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-gray-400 uppercase ml-4">Booking PNR</span>
                                        <div className="bg-[#f2f6fa] rounded-xl px-6 py-4 text-xs font-black text-gray-600 border border-gray-100">
                                          {booking.pnr}
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-gray-400 uppercase ml-4">Total Fare (INR)</span>
                                        <div className="bg-[#f2f6fa] rounded-xl px-6 py-4 text-xs font-black text-gray-600 border border-gray-100">
                                          ₹{booking.totalFare}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions Row */}
                                  <div className="flex items-center justify-between gap-4 pt-6 mt-4 border-t border-gray-100">
                                    <div className="text-[10px] font-black text-gray-300 uppercase">
                                      Request ID: {booking.id} <span className="mx-2">•</span> Booked on: {new Date(booking.created_at || booking.bookDate).toLocaleDateString('en-IN')}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => router.push(`/get-ticket?pnr=${booking.pnr}`)}
                                        className="px-6 py-3 bg-[#0052cc] text-white rounded-xl text-xs font-black transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-100"
                                      >
                                        View Ticket
                                      </button>
                                      {canCancelBooking(booking) && (
                                        <button
                                          onClick={() => handleCancelBooking(booking)}
                                          className="px-6 py-3 bg-red-50 text-red-500 rounded-xl text-xs font-black transition-all hover:bg-red-100 active:scale-95"
                                        >
                                          Cancel
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
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
    </div >
  );
}