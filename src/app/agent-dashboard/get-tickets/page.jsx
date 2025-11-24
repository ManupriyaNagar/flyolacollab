/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TicketView from "./../../../components/Ticket/TicketView"; // Adjust path as needed
import BASE_URL from "@/baseUrl/baseUrl";
import { FaPlane } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Page = () => {
  const { authState } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [airportMap, setAirportMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const itemsPerPage = 10;

  // Redirect if not Booking Agent (role 2)
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || String(authState.userRole) !== "2")) {
      router.push("/sign-in");
    }
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole]);

  // Fetch user-specific bookings
  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn || String(authState.userRole) !== "2") {
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

        // Fetch bookings and airports
        const [bookingsRes, airportRes] = await Promise.all([
          fetch(`${BASE_URL}/bookings/my`, commonOpts),
          fetch(`${BASE_URL}/airport`, commonOpts),
        ]);

        if (!bookingsRes.ok) {
          throw new Error(`Failed to fetch bookings: ${bookingsRes.status}`);
        }
        if (!airportRes.ok) {
          throw new Error(`Failed to fetch airports: ${airportRes.status}`);
        }

        const [bookingsData, airportData] = await Promise.all([
          bookingsRes.json(),
          airportRes.json(),
        ]);

        // Build airport map
        const map = Object.fromEntries(
          (airportData || []).filter(a => a?.id && a?.airport_name).map(a => [a.id, a.airport_name])
        );
        setAirportMap(map);

        // Process bookings
        const processedBookings = (bookingsData || []).map((booking) => {
          const flightSchedule = booking.FlightSchedule || {};
          const depId = flightSchedule.departure_airport_id;
          const arrId = flightSchedule.arrival_airport_id;
          const seatLabels = Array.isArray(booking.seatLabels)
            ? booking.seatLabels.join(", ")
            : booking.BookedSeats?.map(s => s.seat_label).join(", ") || "N/A";

          if (!depId || !arrId) {
          }

          return {
            ...booking,
            FlightSchedule: flightSchedule,
            booked_seat: seatLabels,
            passengers: booking.Passengers || [],
            payment: booking.Payments?.[0] || {},
            billing: booking.billing || {},
            departureAirportName: depId && map[depId] ? map[depId] : "Unknown Airport",
            arrivalAirportName: arrId && map[arrId] ? map[arrId] : "Unknown Airport",
          };
        }).sort((a, b) => new Date(b.bookDate).getTime() - new Date(a.bookDate).getTime());

        setBookings(processedBookings);
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
  }, [authState.isLoggedIn, authState.userRole]);

  // Helper function to get date boundaries
  const getDateFilterRange = (filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    switch (filter) {
      case "today": return { start: today, end: today };
      case "tomorrow": return { start: tomorrow, end: tomorrow };
      case "yesterday": return { start: yesterday, end: yesterday };
      case "custom": return startDate && endDate ? { start: startDate, end: endDate } : null;
      default: return null;
    }
  };

  // Filter bookings by date
  const filteredBookings = React.useMemo(() => {
    let data = bookings;

    if (["today", "tomorrow", "yesterday", "custom"].includes(dateFilter)) {
      const dateRange = getDateFilterRange(dateFilter);
      if (dateRange) {
        data = data.filter((booking) => {
          const bookDate = new Date(booking.bookDate);
          bookDate.setHours(0, 0, 0, 0);
          return (
            bookDate.getTime() >= dateRange.start.getTime() &&
            bookDate.getTime() <= dateRange.end.getTime()
          );
        });
      }
    }

    return data;
  }, [bookings, dateFilter, startDate, endDate]);

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "24px" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", marginBottom: "24px", textAlign: "center" }}>
        My Booking History
      </h1>

      {/* Date Filter */}
      <div style={{ marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
        <select
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
            if (e.target.value !== "custom") {
              setDateRange([null, null]);
            }
          }}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            backgroundColor: "#ffffff",
            cursor: "pointer",
          }}
          aria-label="Select date filter"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="yesterday">Yesterday</option>
          <option value="custom">Custom Date Range</option>
        </select>
        {dateFilter === "custom" && (
          <div style={{ display: "flex", gap: "8px" }}>
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
              }}
              aria-label="Select start date"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
              }}
              aria-label="Select end date"
            />
          </div>
        )}
      </div>

      {/* Error Message and Retry Button */}
      {error && (
        <div style={{ textAlign: "center", padding: "16px", marginBottom: "16px", backgroundColor: "#fee2e2", borderRadius: "8px" }}>
          <p style={{ color: "#dc2626" }}>{error}</p>
          {error.includes("Failed to load bookings") && (
            <button
              onClick={() => fetchBookings()}
              style={{
                marginTop: "8px",
                padding: "8px 16px",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                borderRadius: "8px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Passenger Name</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Date of Flight</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                    <svg
                      className="animate-spin h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Loading bookings...
                  </div>
                </td>
              </tr>
            ) : currentBookings.length === 0 && !error ? (
              <tr>
                <td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                  {dateFilter !== "all" ? "No bookings match your date filter." : "No bookings found."}
                </td>
              </tr>
            ) : (
              currentBookings.map((booking) => (
                <tr key={booking.bookingNo} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>
                    {booking.passengers?.map((p) => p.name).join(", ") || "N/A"}
                  </td>
                  <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>
                    {booking.bookDate ? new Date(booking.bookDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        style={{
                          backgroundColor: "#4f46e5",
                          color: "#ffffff",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                          border: "none",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
                        aria-label={`View ticket for booking ${booking.bookingNo || "N/A"}`}
                      >
                        <FaPlane /> View Ticket
                      </button>
                    </div>
                    {/* Render TicketView off-screen for download */}
                    <TicketView
                      isOpen={false}
                      onClose={() => {}}
                      booking={booking}
                      isDownload={true}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "24px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              backgroundColor: currentPage === 1 ? "#e5e7eb" : "#4f46e5",
              color: currentPage === 1 ? "#6b7280" : "#ffffff",
              borderRadius: "8px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              border: "none",
            }}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#374151" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              backgroundColor: currentPage === totalPages ? "#e5e7eb" : "#4f46e5",
              color: currentPage === totalPages ? "#6b7280" : "#ffffff",
              borderRadius: "8px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              border: "none",
            }}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}

      {selectedBooking && (
        <TicketView
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default Page;