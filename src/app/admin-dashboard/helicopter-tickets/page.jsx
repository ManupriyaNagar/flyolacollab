"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useAuth } from "@/components/AuthContext";
import { transformTicketData } from "@/utils/ticketDataTransformer";
import {
    ArrowsUpDownIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    TicketIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfessionalTicket from "./../../../components/SingleTicket/ProfessionalTicket";

const HelicopterTicketsPage = () => {
  const { authState } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [helipadMap, setHelipadMap] = useState({});
  const [helipadCodeMap, setHelipadCodeMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [startDate, endDate] = dateRange;
  const itemsPerPage = 10;

  // Redirect if not admin or operations
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || (String(authState.userRole) !== "1" && String(authState.userRole) !== "6"))) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  // Fetch bookings
  useEffect(() => {
    if (
      authState.isLoading ||
      !authState.isLoggedIn ||
      (String(authState.userRole) !== "1" && String(authState.userRole) !== "6")
    ) {
      return;
    }

    async function fetchBookings() {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token") || "";
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const commonOpts = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          bookingsRes,
          helipadsRes,
        ] = await Promise.all([
          fetch(`${BASE_URL}/bookings/helicopter-bookings`, commonOpts).catch(() => ({ ok: false, status: 404 })),
          fetch(`${BASE_URL}/helipads`, commonOpts).catch(() => ({ ok: false, status: 404 })),
        ]);

        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
        const helipadsData = helipadsRes.ok ? await helipadsRes.json() : [];

        // Build helipad map with both name and code
        const helipadMapping = {};
        const helipadCodeMapping = {};
        if (Array.isArray(helipadsData)) {
          helipadsData.forEach(helipad => {
            if (helipad.id) {
              helipadMapping[helipad.id] = helipad.helipad_name || helipad.city || 'Unknown';
              helipadCodeMapping[helipad.id] = helipad.helipad_code || 'HPD';
            }
          });
        }
        setHelipadMap(helipadMapping);
        setHelipadCodeMap(helipadCodeMapping);

        // Process helicopter bookings - they already come with all data from backend
        const merged = (Array.isArray(bookingsData) ? bookingsData : [])
          .map((booking) => {
            // Backend sends departureHelipad/arrivalHelipad, map to expected field names
            const departure = booking.departureHelipad || booking.departureHelipadName || 'Unknown Helipad';
            const arrival = booking.arrivalHelipad || booking.arrivalHelipadName || 'Unknown Helipad';
            
            console.log('Processing booking:', {
              id: booking.id,
              bookingNo: booking.bookingNo,
              departureHelipad: booking.departureHelipad,
              arrivalHelipad: booking.arrivalHelipad,
              departure,
              arrival
            });
            
            // Extract passenger names from backend response
            const passengerNames = booking.passengerNames || 
                                  booking.Passengers?.map(p => p.name).join(', ') || 
                                  'N/A';
            
            // Get helipad codes from the schedule
            const departureHelipadId = booking.HelicopterSchedule?.departure_helipad_id;
            const arrivalHelipadId = booking.HelicopterSchedule?.arrival_helipad_id;
            const departureCode = helipadCodeMapping[departureHelipadId] || 'HPD';
            const arrivalCode = helipadCodeMapping[arrivalHelipadId] || 'HPD';
            
            return {
              ...booking,
              bookingType: 'helicopter',
              departureAirportName: departure, // Use airport field names for compatibility with table
              arrivalAirportName: arrival,
              departureHelipadName: departure,
              arrivalHelipadName: arrival,
              helicopterNumber: booking.helicopterNumber || 'N/A',
              flightNumber: booking.helicopterNumber || 'N/A',
              passengerNames: passengerNames,
              // Also add bookingData structure for compatibility
              bookingData: {
                departure: departure,
                arrival: arrival,
                bookDate: booking.bookDate,
                flightNumber: booking.helicopterNumber || 'N/A',
                helicopterNumber: booking.helicopterNumber || 'N/A',
                bookingType: 'helicopter', // IMPORTANT: Add bookingType here for ticket component
                departureCode: departureCode, // Actual helipad code
                arrivalCode: arrivalCode, // Actual helipad code
                departureTime: booking.departureTime || booking.HelicopterSchedule?.departure_time || 'N/A',
                arrivalTime: booking.arrivalTime || booking.HelicopterSchedule?.arrival_time || 'N/A',
                totalPrice: booking.totalFare
              },
              // Add travelerDetails for ticket display
              travelerDetails: booking.Passengers?.map((p, index) => ({
                title: p.title || 'Mr',
                fullName: p.name,
                age: p.age,
                type: p.type || 'Adult',
                seat: booking.BookedSeats?.[index]?.seat_label || 'N/A',
                // Add contact info to first passenger for ticket display
                ...(index === 0 && {
                  email: booking.email_id || booking.billing?.billing_email || 'N/A',
                  phone: booking.contact_no || booking.billing?.billing_number || 'N/A'
                })
              })) || [],
              // Add bookingResult for ticket display
              bookingResult: {
                booking: {
                  pnr: booking.pnr,
                  bookingNo: booking.bookingNo,
                  bookDate: booking.bookDate,
                  totalFare: booking.totalFare,
                  noOfPassengers: booking.noOfPassengers,
                  bookingStatus: booking.bookingStatus,
                  paymentStatus: booking.paymentStatus,
                  bookedSeats: booking.BookedSeats?.map(s => s.seat_label) || []
                },
                passengers: booking.Passengers?.map((p, index) => ({
                  name: p.name,
                  title: p.title,
                  age: p.age,
                  type: p.type,
                  seat: booking.BookedSeats?.[index]?.seat_label || 'N/A'
                })) || []
              }
            };
          })
          .sort(
            (a, b) =>
              new Date(b.bookDate).getTime() - new Date(a.bookDate).getTime()
          );

        setBookings(merged);
      } catch (err) {
        if (err.message.includes("No authentication token")) {
          setError("Please log in again to view bookings.");
          router.push("/sign-in");
        } else {
          setError(`Failed to load bookings: ${err.message}`);
          toast.error(`Failed to load bookings: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [authState.isLoggedIn, authState.userRole, authState.isLoading]);

  // Helper function to get date boundaries
  const getDateFilterRange = (filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    switch (filter) {
      case "today":
        return { start: today, end: today };
      case "tomorrow":
        return { start: tomorrow, end: tomorrow };
      case "yesterday":
        return { start: yesterday, end: yesterday };
      case "custom":
        return startDate && endDate ? { start: startDate, end: endDate } : null;
      default:
        return null;
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter bookings by date and search
  const filteredBookings = React.useMemo(() => {
    let data = bookings;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((booking) => {
        // Handle both transformed and raw booking data
        const bookingNo = booking.bookingResult?.booking?.bookingNo || booking.bookingNo;
        const pnr = booking.bookingResult?.booking?.pnr || booking.pnr;
        const passengerNames = booking.travelerDetails?.map(p => p.fullName?.toLowerCase()).join(' ') || 
                              booking.passengers?.map(p => p.name?.toLowerCase()).join(' ');
        const departure = booking.bookingData?.departure || booking.departureAirportName;
        const arrival = booking.bookingData?.arrival || booking.arrivalAirportName;
        
        return [
          bookingNo?.toString().toLowerCase(),
          pnr?.toLowerCase(),
          passengerNames,
          departure?.toLowerCase(),
          arrival?.toLowerCase(),
        ].some((field) => field?.includes(term));
      });
    }

    // Apply date filter
    if (["today", "tomorrow", "yesterday", "custom"].includes(dateFilter)) {
      const dateRange = getDateFilterRange(dateFilter);
      if (dateRange) {
        data = data.filter((booking) => {
          const bookDate = new Date(booking.bookingData?.bookDate || booking.bookDate);
          bookDate.setHours(0, 0, 0, 0);
          return (
            bookDate.getTime() >= dateRange.start.getTime() &&
            bookDate.getTime() <= dateRange.end.getTime()
          );
        });
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'bookDate') {
          aValue = new Date(aValue || a.bookingData?.bookDate).getTime();
          bValue = new Date(bValue || b.bookingData?.bookDate).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [bookings, dateFilter, startDate, endDate, searchTerm, sortConfig]);

  // Calculate paginated bookings
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle viewing a ticket
  const handleViewTicket = (booking) => {
    // If booking is already transformed, use it directly
    if (booking.bookingData && booking.travelerDetails && booking.bookingResult) {
      setSelectedBooking(booking);
    } else {
      // Transform raw booking data
      try {
        const transformedData = transformTicketData(booking, airportMap);
        setSelectedBooking(transformedData);
      } catch (error) {
        toast.error('Unable to display ticket. Data may be incomplete.');
        return;
      }
    }
    setShowTicketModal(true);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500 rotate-180" /> :
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <TicketIcon className="w-8 h-8 text-white" />
            </div>
            Helicopter Ticket Management
          </h1>
          <p className="text-slate-600 mt-2">View and manage helicopter tickets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by booking ID, PNR, passenger name..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
              if (e.target.value !== "custom") {
                setDateRange([null, null]);
              }
            }}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom Date Range</option>
          </select>
          
          {dateFilter === "custom" && (
            <div className="flex gap-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setDateRange([date, endDate]);
                  setCurrentPage(1);
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || new Date()}
                placeholderText="Start Date"
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setDateRange([startDate, date]);
                  setCurrentPage(1);
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                placeholderText="End Date"
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-pink-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <TicketIcon className="w-6 h-6 text-pink-600" />
            Flight Tickets ({filteredBookings.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'bookingNo', label: 'Booking ID', sortable: true },
                  { key: 'pnr', label: 'PNR', sortable: true },
                  { key: 'passengers', label: 'Passenger Names', sortable: false },
                  { key: 'passengerWeights', label: 'Weights (kg)', sortable: false },
                  { key: 'bookDate', label: 'Flight Date', sortable: true },
                  { key: 'departureAirportName', label: 'Route', sortable: false },
                  { key: 'actions', label: 'Actions', sortable: false },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                    }`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : currentBookings.length === 0 && !error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <TicketIcon className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="text-slate-500 font-medium">No tickets found</p>
                        <p className="text-slate-400 text-sm">
                          {dateFilter !== "all" || searchTerm ? "Try adjusting your filters" : "No tickets available"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentBookings.map((booking) => {
                  // Handle both transformed and raw booking data
                  const bookingNo = booking.bookingResult?.booking?.bookingNo || booking.bookingNo;
                  const pnr = booking.bookingResult?.booking?.pnr || booking.pnr;
                  const bookDate = booking.bookingData?.bookDate || booking.bookDate;
                  const passengerNames = booking.travelerDetails?.map(p => p.fullName).join(', ') || 
                                        booking.passengers?.map(p => p.name).join(', ') || 'N/A';
                  const departure = booking.bookingData?.departure || booking.departureAirportName;
                  const arrival = booking.bookingData?.arrival || booking.arrivalAirportName;
                  
                  return (
                    <tr key={bookingNo || booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                        {bookingNo || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {pnr || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 max-w-[250px]">
                          <UserGroupIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span 
                            className="text-slate-700 truncate" 
                            title={passengerNames}
                          >
                            {passengerNames}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        <div className="max-w-[150px] truncate" title={booking.Passengers?.map((p) => p.weight ? `${p.weight}kg` : '-').join(", ") || "N/A"}>
                          {booking.Passengers?.map((p) => p.weight ? `${p.weight}` : '-').join(", ") || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            {bookDate ? new Date(bookDate).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-700 max-w-[200px]">
                          <div className="font-medium truncate" title={departure}>
                            {departure || 'Unknown'}
                          </div>
                          <div className="text-sm text-slate-500 truncate" title={`to ${arrival}`}>
                            to {arrival || 'Unknown'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewTicket(booking)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-sm font-medium"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View Ticket
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-6 border-t border-slate-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Professional Ticket Modal */}
      {selectedBooking && showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowTicketModal(false);
                setSelectedBooking(null);
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              ×
            </button>
            <ProfessionalTicket
              bookingData={selectedBooking.bookingData}
              travelerDetails={selectedBooking.travelerDetails}
              bookingResult={selectedBooking.bookingResult}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HelicopterTicketsPage;