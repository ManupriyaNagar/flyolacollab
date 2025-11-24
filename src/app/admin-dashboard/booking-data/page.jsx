/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import BASE_URL from "@/baseUrl/baseUrl";
import BookingDetailsModal from "@/components/BookingDetailsModal";

const BOOKINGS_PER_PAGE = 50;

export default function AllBookingsPage() {
  const { authState } = useAuth();
  const router = useRouter();

  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState("Confirmed");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [airportMap, setAirportMap] = useState({});
  const [downloadRange, setDownloadRange] = useState("page");
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || String(authState.userRole) !== "1")) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    if (
      authState.isLoading ||
      !authState.isLoggedIn ||
      String(authState.userRole) !== "1"
    ) {
      return;
    }

    async function fetchAllData() {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token") || "";
        const commonOpts = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // Check cached airport data
        const cachedAirports = localStorage.getItem("airports");
        let airportData = cachedAirports ? JSON.parse(cachedAirports) : null;

        // Fetch data in parallel
        const [bookingsRes, paxRes, paymentsRes, airportRes] = await Promise.all([
          fetch(`${BASE_URL}/bookings?status=${status}`, commonOpts).catch(() => ({ ok: false, status: 500 })),
          fetch(`${BASE_URL}/passenger`, commonOpts).catch(() => ({ ok: false, status: 500 })),
          fetch(`${BASE_URL}/payments`, commonOpts).catch(() => ({ ok: false, status: 500 })),
          airportData ? Promise.resolve({ ok: true, json: () => Promise.resolve(airportData) }) :
            fetch(`${BASE_URL}/airport`, commonOpts).catch(() => ({ ok: false, status: 500 })),
        ]);

        const [bookingsData, paxData, paymentsData, fetchedAirportData] = await Promise.all([
          bookingsRes.ok ? bookingsRes.json() : Promise.resolve([]),
          paxRes.ok ? paxRes.json() : Promise.resolve([]),
          paymentsRes.ok ? paymentsRes.json() : Promise.resolve([]),
          airportRes.ok ? airportRes.json() : Promise.resolve([]),
        ]);

        // Cache airport data
        if (!airportData && fetchedAirportData.length) {
          localStorage.setItem("airports", JSON.stringify(fetchedAirportData));
          airportData = fetchedAirportData;
        }

        // Warn for failed APIs
        if (!bookingsRes.ok) {
          toast.warn("Unable to load bookings data.");
        }
        if (!paxRes.ok) {
          toast.warn("Unable to load passenger data.");
        }
        if (!paymentsRes.ok) {
          toast.warn("Unable to load payment data.");
        }
        if (!airportRes.ok && !airportData) {
          toast.warn("Unable to load airport data.");
        }

        // Build airport map
        const map = {};
        (Array.isArray(airportData) ? airportData : []).forEach((a) => {
          if (a?.id && a?.airport_name) {
            map[a.id] = a.airport_name;
          }
        });
        setAirportMap(map);

        // Validate bookings data
        const validBookingsData = Array.isArray(bookingsData) ? bookingsData : [];
        if (!validBookingsData.length && bookingsRes.ok) {
          toast.warn("No bookings found for the selected status.");
        }

        const merged = validBookingsData
          .map((booking) => {
            const passengers = (Array.isArray(paxData) ? paxData : []).filter(
              (p) => p?.bookingId === booking?.id
            );

            const payment = (Array.isArray(paymentsData) ? paymentsData : [])
              .find((p) => p?.booking_id === booking?.id) || {};

            const flightSchedule = booking.FlightSchedule || {};
            const depId = flightSchedule.departure_airport_id;
            const arrId = flightSchedule.arrival_airport_id;

            // Handle seat labels
            const seatLabels = Array.isArray(booking.BookedSeats)
              ? booking.BookedSeats.map((s) => s.seat_label).join(", ")
              : "N/A";

            // Use enhanced data from backend if available, otherwise fallback to old logic
            const flightNumber = booking.flightNumber || flightSchedule.Flight?.flight_number || "N/A";
            const billingName = booking.billingName || booking.billing?.billing_name || "N/A";
            const paymentMode = booking.paymentMode || payment.payment_mode || booking.pay_mode || "N/A";
            const departureAirportName = booking.departureAirport || (depId && map[depId] ? map[depId] : "N/A");
            const arrivalAirportName = booking.arrivalAirport || (arrId && map[arrId] ? map[arrId] : "N/A");
            const passengerNames = booking.passengerNames || passengers?.map((p) => p.name).join(", ") || "N/A";
            const transactionId = booking.transactionId || payment.transaction_id || "N/A";
            const agentId = booking.agentId || "FLYOLA";
            const userRole = booking.userRole || "3";

            return {
              ...booking,
              FlightSchedule: flightSchedule,
              booked_seat: seatLabels,
              passengers,
              flightNumber,
              billingName,
              paymentMode,
              departureAirportName,
              arrivalAirportName,
              passengerNames,
              transactionId,
              agentId,
              userRole,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.bookDate).getTime() - new Date(a.bookDate).getTime()
          );

        setAllData(merged);
        setCurrentPage(1);

        if (!merged.length && !error) {
          setError("No bookings found for the selected status.");
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllData();
  }, [status, authState.isLoggedIn, authState.userRole]);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return allData;
    const term = searchTerm.toLowerCase();
    const filtered = allData.filter((item) => {
      const bookingNo = item.bookingNo?.toString().toLowerCase() ?? "";
      const pnr = item.pnr?.toLowerCase() ?? "";
      const email = item.email_id?.toLowerCase() ?? "";
      const contact = item.contact_no?.toString().toLowerCase() ?? "";
      const passengerNames =
        item.passengers?.map((p) => p.name?.toLowerCase()).join(" ") ?? "";
      const billingName = item.billingName?.toLowerCase() ?? "";
      return (
        bookingNo.includes(term) ||
        pnr.includes(term) ||
        email.includes(term) ||
        contact.includes(term) ||
        passengerNames.includes(term) ||
        billingName.includes(term)
      );
    });
    return filtered;
  }, [allData, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / BOOKINGS_PER_PAGE) || 1;
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * BOOKINGS_PER_PAGE;
    const sliced = filteredData.slice(start, start + BOOKINGS_PER_PAGE);
    return sliced;
  }, [filteredData, currentPage]);

  // Excel export
  const exportToExcel = useCallback(() => {
    let exportData = [];
    let filename = `AllBookings_Page_${currentPage}.xlsx`;

    if (downloadRange === "page") {
      exportData = currentData;
    } else if (downloadRange === "all") {
      exportData = filteredData;
      filename = "AllBookings_AllData.xlsx";
    } else if (downloadRange.startsWith("month-")) {
      const [year, month] = downloadRange.split("-").slice(1);
      exportData = filteredData.filter((item) => {
        const date = new Date(item.bookDate);
        return date.getFullYear() === parseInt(year) && date.getMonth() === parseInt(month) - 1;
      });
      filename = `AllBookings_${year}_${month}.xlsx`;
    } else if (downloadRange.startsWith("year-")) {
      const year = downloadRange.split("-")[1];
      exportData = filteredData.filter((item) => new Date(item.bookDate).getFullYear() === parseInt(year));
      filename = `AllBookings_${year}.xlsx`;
    }

    if (!exportData.length) {
      toast.warn("No data available for the selected range.");
      return;
    }

    const data = exportData.map((item) => ({
      BookingId: item.bookingNo || "N/A",
      PNR: item.pnr || "N/A",
      FlyDate: item.bookDate ? new Date(item.bookDate).toLocaleDateString() : "N/A",
      BookingDate: item.created_at ? new Date(item.created_at).toLocaleString() : "N/A",
      Email: item.email_id || "N/A",
      ContactNumber: item.contact_no || "N/A",
      Passengers: item.noOfPassengers || 0,
      BillingName: item.billingName || "N/A",
      BookedSeats: item.booked_seat || "N/A",
      TotalFare: item.totalFare ? parseFloat(item.totalFare).toFixed(2) : "N/A",
      BookingStatus: item.bookingStatus || "N/A",
      PaymentMode: item.paymentMode || "N/A",
      TransactionId: item.transactionId || "N/A",
      AgentId: item.agentId || "FLYOLA",
      UserRole: item.userRole === "1" ? "Admin" : item.userRole === "2" ? "Booking Agent" : item.userRole === "3" ? "Regular User" : "Unknown",
      DepartureTime: item.FlightSchedule?.departure_time || "N/A",
      ArrivalTime: item.FlightSchedule?.arrival_time || "N/A",
      DepartureAirport: item.departureAirportName || "N/A",
      ArrivalAirport: item.arrivalAirportName || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AllBookings");
    XLSX.writeFile(wb, filename);
    toast.success("Excel file downloaded successfully!");
  }, [currentData, filteredData, downloadRange]);

  // Download options
  const downloadOptions = useMemo(() => {
    const options = [
      { value: "page", label: "Current Page" },
      { value: "all", label: "All Data" },
    ];

    const yearMonthMap = new Map();
    filteredData.forEach((item) => {
      const date = new Date(item.bookDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      if (!yearMonthMap.has(year)) yearMonthMap.set(year, new Set());
      yearMonthMap.get(year).add(month);
    });

    yearMonthMap.forEach((months, year) => {
      options.push({ value: `year-${year}`, label: `Year ${year}` });
      months.forEach((month) => {
        const monthName = new Date(0, month - 1).toLocaleString("default", { month: "long" });
        options.push({ value: `month-${year}-${month}`, label: `${monthName} ${year}` });
      });
    });

    return options;
  }, [filteredData]);

  // Pagination UI helpers
  const getPaginationItems = () => {
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) items.push("...");
    }
    for (let i = startPage; i <= endPage; i++) items.push(i);
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push("...");
      items.push(totalPages);
    }
    return items;
  };

  // View booking handler
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  // JSX
  return (
    <div className="px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-8 text-gray-900">All Bookings Data</h2>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["Confirmed", "Pending", "Cancelled", "All Booking"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatus(filter);
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${status === filter
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            aria-pressed={status === filter}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <input
          type="text"
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Search by ID, PNR, email, phone, passenger name, or billing name..."
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
          aria-label="Search all bookings"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <select
            value={downloadRange}
            onChange={(e) => setDownloadRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select download range"
          >
            {downloadOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={exportToExcel}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm flex items-center gap-2"
            aria-label="Download as Excel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H3a2 2 0 01-2-2V3a2 2 0 012-2h18a2 2 0 012 2v16a2 2 0 01-2 2z"
              />
            </svg>
            Download Excel
          </button>
        </div>
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–
          {Math.min(currentPage * BOOKINGS_PER_PAGE, filteredData.length)} of {filteredData.length} records
        </span>
      </div>

      {/* Error Message and Retry Button */}
      {error && (
        <div className="text-center py-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchAllData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Booking ID",
                "PNR",
                "Flight No",
                "Fly Date",
                "Booking Date",
                "Email",
                "Phone",
                "Passenger Names",
                "Billing Name",
                "Seats",
                "Price",
                "Status",
                "Payment",
                "Transaction ID",
                "Agent",
                "User Role",
                "Dep Time",
                "Arr Time",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!error && isLoading ? (
              <tr>
                <td colSpan={20} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500"
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
                    <span className="text-gray-600">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : currentData.length ? (
              currentData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors duration-100"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.bookingNo || "N/A"}
                  </th>
                  <td className="px-6 py-4 whitespace-nowrap">{item.pnr || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.flightNumber || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.bookDate ? new Date(item.bookDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.email_id || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.contact_no || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.passengerNames || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.billingName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.booked_seat || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.totalFare ? `₹${parseFloat(item.totalFare).toFixed(2)}` : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${item.bookingStatus === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : item.bookingStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.bookingStatus === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {item.bookingStatus || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${item.paymentMode === "RAZORPAY"
                        ? "bg-blue-100 text-blue-800"
                        : item.paymentMode === "ADMIN"
                          ? "bg-green-100 text-green-800"
                          : item.paymentMode === "AGENT"
                            ? "bg-purple-100 text-purple-800"
                            : item.paymentMode === "DUMMY"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {item.paymentMode || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {item.transactionId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {item.agentId || "FLYOLA"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${item.userRole === "1"
                        ? "bg-red-100 text-red-800"
                        : item.userRole === "2"
                          ? "bg-blue-100 text-blue-800"
                          : item.userRole === "3"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {item.userRole === "1" ? "Admin" : item.userRole === "2" ? "Agent" : item.userRole === "3" ? "User" : "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.FlightSchedule?.departure_time || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.FlightSchedule?.arrival_time || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewBooking(item)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                      aria-label={`View booking ${item.bookingNo || "N/A"}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={22} className="px-6 py-8 text-center text-gray-600">
                  {searchTerm ? "No records match your search." : error || "No bookings available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            aria-label="Previous page"
          >
            Previous
          </button>
          {getPaginationItems().map((item, idx) =>
            item === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-4 py-2 text-gray-600">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${currentPage === item
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedBooking(null);
        }}
      />
    </div>
  );
}