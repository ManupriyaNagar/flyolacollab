"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  FaBed,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaHotel,
  FaMoneyBillWave,
  FaPhone,
  FaPrint,
  FaUser
} from "react-icons/fa";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const bookingReference = searchParams.get("bookingReference");
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const API = (await import('@/services/api')).default;
        const response = await API.hotels.getBookingById(bookingId);
        
        if (response && response.data) {
          setBooking(response.data);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your hotel reservation has been successfully confirmed
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Booking Reference: <span className="font-mono font-semibold text-blue-600">{bookingReference || "N/A"}</span>
          </p>
        </div>

        {booking ? (
          <>
            {/* Hotel & Room Details */}
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <FaHotel className="text-blue-600" />
                  Hotel & Room Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">
                      {booking.hotel?.name || "Hotel Name"}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <FaBed className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-600">Room Type</p>
                          <p className="font-medium">{booking.room?.room_number || "Standard Room"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaUser className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-600">Guests</p>
                          <p className="font-medium">{booking.number_of_guests || booking.numberOfGuests} Guest(s)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Stay Duration</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-green-500 mt-1" />
                        <div>
                          <p className="text-gray-600">Check-in</p>
                          <p className="font-medium">{formatDate(booking.check_in_date || booking.checkInDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-red-500 mt-1" />
                        <div>
                          <p className="text-gray-600">Check-out</p>
                          <p className="font-medium">{formatDate(booking.check_out_date || booking.checkOutDate)}</p>
                        </div>
                      </div>
                     
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2">
                  <FaUser className="text-purple-600" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Guest Name</p>
                    <p className="font-semibold text-gray-900">{booking.guest_name || booking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{booking.guest_email || booking.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{booking.guest_phone || booking.guestPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 capitalize">
                      {booking.booking_status || booking.bookingStatus || "Confirmed"}
                    </span>
                  </div>
                </div>
                {booking.special_requests && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                    <p className="text-gray-900">{booking.special_requests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room Price ({booking.number_of_nights || booking.numberOfNights} night(s))</span>
                    <span className="font-medium">₹{(booking.total_amount || booking.totalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">₹{(booking.tax_amount || booking.taxAmount || 0).toLocaleString()}</span>
                  </div>
                  {(booking.discount_amount > 0 || booking.discountAmount > 0) && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{(booking.discount_amount || booking.discountAmount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-600">₹{(booking.final_amount || booking.finalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-yellow-800">
                      <span className="font-semibold">Payment Status:</span> <span className="capitalize">{booking.payment_status || booking.paymentStatus || "Pending"}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="mb-6">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Unable to load booking details</p>
              <p className="text-sm text-gray-500 mt-2">Booking ID: {bookingId}</p>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Check Your Email
                  </h3>
                  <p className="text-sm text-gray-600">
                    A confirmation email with all booking details has been sent
                    to your email address.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Save Your Booking Reference
                  </h3>
                  <p className="text-sm text-gray-600">
                    Keep your booking reference number handy for check-in and
                    any future correspondence.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Arrive on Time
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please arrive during the check-in time mentioned in your
                    booking confirmation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have any questions about your booking, feel free to contact
              us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <FaPhone className="w-4 h-4 text-blue-600" />
                <span className="text-sm">+91 1234567890</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-blue-600" />
                <span className="text-sm">support@flyola.com</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href="/hotels">Browse More Hotels</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <FaPrint className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
