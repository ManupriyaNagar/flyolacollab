"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  FaArrowLeft,
  FaTicketAlt, 
  FaUser, 
  FaCalendarAlt,
  FaPlane,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaRedo
} from "react-icons/fa";
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  Plane,
  DollarSign,
  FileText,
  Filter,
  Download
} from "lucide-react";
import Link from "next/link";
import BASE_URL from "@/baseUrl/baseUrl";

// Loading component for Suspense fallback
const AgentBookingsLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-96">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading agent bookings...</p>
    </div>
  </div>
);

// Main content component that uses useSearchParams
function AgentBookingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = searchParams.get('agentId');
  
  const [agent, setAgent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Fetch agent bookings
  const fetchAgentBookings = async (page = 1) => {
    if (!agentId) {
      setError('Agent ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter !== 'All' && { status: statusFilter }),
        ...(dateFilter && { startDate: dateFilter, endDate: dateFilter })
      });

      const url = `${BASE_URL}/agents/${agentId}/bookings?${params}`;

      const response = await fetch(url, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agent bookings');
      }
      
      const data = await response.json();
      setBookings(data.data || []);
      setAgent(data.agent);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(data.pagination?.page || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch booking details
  const fetchBookingDetails = async (bookingId) => {
    try {
      const url = `${BASE_URL}/bookings/${bookingId}`;
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }
      
      const data = await response.json();
      setSelectedBooking(data);
      setShowBookingModal(true);
    } catch (err) {
      alert('Failed to fetch booking details');
    }
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking =>
    booking.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    if (agentId) {
      fetchAgentBookings();
    }
  }, [agentId, statusFilter, dateFilter]);

  if (!agentId) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Agent ID is required to view bookings</p>
          <Link
            href="/admin-dashboard/agents"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Agents
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !agent) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="sm:w-48">
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Bookings Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex space-x-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 flex-1 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex space-x-4">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <div key={j} className="h-4 flex-1 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => fetchAgentBookings()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin-dashboard/agents"
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            Back to Agents
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaTicketAlt className="text-blue-600" />
              Agent Bookings
            </h1>
            {agent && (
              <p className="text-gray-600 mt-1">
                {agent.username} (ID: {agent.agentId}) - Wallet: ₹{agent.wallet_amount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAgentBookings(currentPage)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaRedo className="text-sm" />
            Refresh
          </button>
        </div>
      </div>

      {/* Agent Stats */}
      {agent && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <FaTicketAlt className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Wallet Balance</p>
                <p className="text-2xl font-bold">₹{agent.wallet_amount.toLocaleString()}</p>
              </div>
              <FaRupeeSign className="h-8 w-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Tickets</p>
                <p className="text-2xl font-bold">{agent.no_of_ticket_booked}</p>
              </div>
              <FaUsers className="h-8 w-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">
                  {bookings.length > 0 
                    ? Math.round((bookings.filter(b => b.bookingStatus === 'SUCCESS').length / bookings.length) * 100)
                    : 0}%
                </p>
              </div>
              <FaPlane className="h-8 w-8 text-orange-200" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by PNR, Booking No, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setDateFilter('');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flight Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Passengers
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">PNR: {booking.pnr}</div>
                      <div className="text-sm text-gray-500">Booking: {booking.bookingNo}</div>
                      <div className="text-sm text-gray-500">{formatDate(booking.bookDate)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {booking.FlightSchedule ? (
                        <>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            <FaPlane className="text-blue-500" />
                            {booking.FlightSchedule.Flight?.flight_number || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FaMapMarkerAlt className="text-gray-400" />
                            {booking.FlightSchedule.DepartureAirport?.city || 'N/A'} → {booking.FlightSchedule.ArrivalAirport?.city || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FaClock className="text-gray-400" />
                            {formatTime(booking.FlightSchedule.departure_time)} - {formatTime(booking.FlightSchedule.arrival_time)}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">Flight info not available</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUsers className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-900">{booking.noOfPassengers}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Seats: {booking.seatLabels?.join(', ') || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaRupeeSign className="text-green-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {parseFloat(booking.totalFare).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.bookingStatus === 'SUCCESS' 
                        ? 'bg-green-100 text-green-800'
                        : booking.bookingStatus === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => fetchBookingDetails(booking.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <FaEye className="text-xs" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'All' || dateFilter 
                ? 'Try adjusting your search filters.' 
                : 'This agent has not made any bookings yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAgentBookings(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => fetchAgentBookings(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Booking Details - {selectedBooking.pnr}
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Booking Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">PNR:</span>
                    <span className="font-medium">{selectedBooking.pnr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking No:</span>
                    <span className="font-medium">{selectedBooking.bookingNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(selectedBooking.bookDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedBooking.bookingStatus === 'SUCCESS' 
                        ? 'bg-green-100 text-green-800'
                        : selectedBooking.bookingStatus === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedBooking.bookingStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fare:</span>
                    <span className="font-medium">₹{parseFloat(selectedBooking.totalFare).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedBooking.email_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedBooking.contact_no}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passengers */}
            {selectedBooking.Passengers && selectedBooking.Passengers.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Passengers</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedBooking.Passengers.map((passenger, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {passenger.title} {passenger.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{passenger.age}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{passenger.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Flight Details */}
            {selectedBooking.FlightSchedule && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Flight Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flight:</span>
                      <span className="font-medium">{selectedBooking.FlightSchedule.Flight?.flight_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departure:</span>
                      <span className="font-medium">
                        {selectedBooking.FlightSchedule.DepartureAirport?.city || 'N/A'} 
                        ({formatTime(selectedBooking.FlightSchedule.departure_time)})
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrival:</span>
                      <span className="font-medium">
                        {selectedBooking.FlightSchedule.ArrivalAirport?.city || 'N/A'} 
                        ({formatTime(selectedBooking.FlightSchedule.arrival_time)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seats:</span>
                      <span className="font-medium">{selectedBooking.seatLabels?.join(', ') || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function AgentBookingsPage() {
  return (
    <Suspense fallback={<AgentBookingsLoadingFallback />}>
      <AgentBookingsContent />
    </Suspense>
  );
}