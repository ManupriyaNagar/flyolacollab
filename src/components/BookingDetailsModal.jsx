"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  // Detect if this is a helicopter booking
  const isHelicopterBooking = booking.helicopterSchedule || booking.helicopterNumber;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentModeColor = (mode) => {
    switch (mode?.toUpperCase()) {
      case "RAZORPAY":
        return "bg-blue-100 text-blue-800";
      case "ADMIN":
        return "bg-green-100 text-green-800";
      case "AGENT":
        return "bg-purple-100 text-purple-800";
      case "IRCTC":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Booking Details - {booking.bookingNo || "N/A"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Booking Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking ID</label>
                  <p className="text-sm text-gray-900">{booking.bookingNo || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">PNR</label>
                  <p className="text-sm text-gray-900">{booking.pnr || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {isHelicopterBooking ? "Helicopter Number" : "Flight Number"}
                  </label>
                  <p className="text-sm text-gray-900">
                    {isHelicopterBooking 
                      ? (booking.helicopterNumber ? `🚁 ${booking.helicopterNumber}` : "N/A")
                      : (booking.flightNumber || "N/A")
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus || "N/A"}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Agent</label>
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {booking.agentId || "FLYOLA"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                {isHelicopterBooking ? "🚁 Helicopter Details" : "Flight Details"}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {isHelicopterBooking ? "Flight Date" : "Flight Date"}
                  </label>
                  <p className="text-sm text-gray-900">
                    {booking.bookDate ? new Date(booking.bookDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Departure Time</label>
                  <p className="text-sm text-gray-900">
                    {isHelicopterBooking 
                      ? (booking.helicopterSchedule?.departure_time || "N/A")
                      : (booking.FlightSchedule?.departure_time || "N/A")
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Arrival Time</label>
                  <p className="text-sm text-gray-900">
                    {isHelicopterBooking 
                      ? (booking.helicopterSchedule?.arrival_time || "N/A")
                      : (booking.FlightSchedule?.arrival_time || "N/A")
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {isHelicopterBooking ? "From (Helipad)" : "From"}
                  </label>
                  <p className="text-sm text-gray-900">
                    {isHelicopterBooking 
                      ? (booking.departureHelipadName || "N/A")
                      : (booking.departureAirportName || "N/A")
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {isHelicopterBooking ? "To (Helipad)" : "To"}
                  </label>
                  <p className="text-sm text-gray-900">
                    {isHelicopterBooking 
                      ? (booking.arrivalHelipadName || "N/A")
                      : (booking.arrivalAirportName || "N/A")
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Seats</label>
                  <p className="text-sm text-gray-900">{booking.booked_seat || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Payment Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Fare</label>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(booking.totalFare)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Mode</label>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getPaymentModeColor(booking.paymentMode)}`}>
                    {booking.paymentMode || "N/A"}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                  <p className="text-sm text-gray-900 font-mono">{booking.transactionId || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment ID</label>
                  <p className="text-sm text-gray-900 font-mono">{booking.paymentId || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Discount</label>
                  <p className="text-sm text-gray-900">{formatCurrency(booking.discount) || "₹0.00"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{booking.email_id || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">{booking.contact_no || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Billing Name</label>
                  <p className="text-sm text-gray-900">{booking.billingName || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Booking Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking Date</label>
                  <p className="text-sm text-gray-900">{formatDate(booking.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">{formatDate(booking.updated_at)}</p>
                </div>
                {booking.cancelledAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cancelled At</label>
                    <p className="text-sm text-gray-900">{formatDate(booking.cancelledAt)}</p>
                  </div>
                )}
                {booking.cancellationReason && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cancellation Reason</label>
                    <p className="text-sm text-gray-900">{booking.cancellationReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Passengers Information */}
          {booking.passengers && booking.passengers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Passenger Information ({booking.passengers.length} passengers)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Name</label>
                        <p className="text-sm font-medium text-gray-900">
                          {passenger.title} {passenger.name}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Age</label>
                          <p className="text-sm text-gray-900">{passenger.age || "N/A"}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Type</label>
                          <p className="text-sm text-gray-900">{passenger.type || "N/A"}</p>
                        </div>
                      </div>
                      {passenger.dob && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">Date of Birth</label>
                          <p className="text-sm text-gray-900">
                            {new Date(passenger.dob).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Information */}
          {booking.bookingStatus === "CANCELLED" && (
            <div className="bg-red-50 p-4 rounded-lg space-y-3">
              <h3 className="text-lg font-semibold text-red-900">Cancellation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-red-700">Refund Amount</label>
                  <p className="text-sm text-red-900">{formatCurrency(booking.refundAmount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-red-700">Cancellation Charges</label>
                  <p className="text-sm text-red-900">{formatCurrency(booking.cancellationCharges)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-red-700">Cancelled At</label>
                  <p className="text-sm text-red-900">{formatDate(booking.cancelledAt)}</p>
                </div>
              </div>
              {booking.cancellationReason && (
                <div>
                  <label className="text-sm font-medium text-red-700">Reason</label>
                  <p className="text-sm text-red-900">{booking.cancellationReason}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;