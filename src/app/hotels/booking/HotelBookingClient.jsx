"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import API from '@/services/api';
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  FaCheckCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaUser
} from "react-icons/fa";
import { toast } from 'react-toastify';

export default function HotelBookingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Get booking details from URL params
  const hotelId = searchParams.get("hotelId") || "1";
  const hotelName = searchParams.get("hotelName") || "Grand Palace Hotel";
  const roomName = searchParams.get("roomName") || "Deluxe Room";
  const roomId = searchParams.get("roomId") || null;
  const roomPrice = parseInt(searchParams.get("roomPrice")) || 3500;
  const checkin = searchParams.get("checkin") || "";
  const checkout = searchParams.get("checkout") || "";
  const rooms = parseInt(searchParams.get("rooms")) || 1;
  const adults = parseInt(searchParams.get("adults")) || 2;
  const children = parseInt(searchParams.get("children")) || 0;
  const location = searchParams.get("location") || "Central Mumbai";
  const rating = parseFloat(searchParams.get("rating")) || 4.5;
  const hotelImage = searchParams.get("hotelImage") || searchParams.get("image") || "";

  // Guest details state
  const [guestDetails, setGuestDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  // Calculate booking details
  const calculateNights = () => {
    if (!checkin || !checkout) return 1;
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = Math.abs(checkoutDate - checkinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();
  const subtotal = roomPrice * nights * rooms;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (createdBooking) => {
    try {
      console.log("Starting payment flow for booking:", createdBooking);
      console.log("Checking Hotel API availability:", API?.hotels ? "Available" : "Missing");
      
      if (!API?.hotels?.createOrder) {
        console.error("Hotel API structure:", API?.hotels);
        throw new Error("Hotel Booking API not properly initialized. Please refresh the page.");
      }
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        return false;
      }

      // Create Razorpay order
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
      
      if (!razorpayKey) {
        toast.error('Payment gateway not configured. Please contact support.');
        return false;
      }

      // Create Razorpay order on backend
      const orderParams = {
        amount: Math.round(total * 100),
        currency: 'INR',
        receipt: `receipt_${createdBooking.booking_reference}`
      };

      console.log("Creating Razorpay order on backend:", orderParams);
      const orderResponse = await API.hotels.createOrder(orderParams);
      
      if (!orderResponse || !orderResponse.order_id) {
        throw new Error("Failed to create Razorpay order on backend");
      }

      const options = {
        key: razorpayKey,
        amount: Math.round(total * 100), // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Flyola',
        description: `Hotel Booking - ${hotelName}`,
        image: '/logo.png',
        order_id: orderResponse.order_id, // Pass the backend-created order ID
        handler: async function (response) {
          try {
            // Payment successful
            console.log('Payment successful:', response);
            
            // Verify payment and update booking in backend
            const verificationData = {
              booking_id: createdBooking.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            console.log("Verifying payment:", verificationData);
            const verifyResponse = await API.hotels.verifyPayment(verificationData);
            
            if (verifyResponse && verifyResponse.data) {
              toast.success("Payment verified! Booking confirmed.");
              
              // Redirect to confirmation page
              router.push(`/hotels/confirmation?bookingId=${verifyResponse.data.id}&bookingReference=${verifyResponse.data.booking_reference || verifyResponse.data.bookingReference}`);
            } else {
              throw new Error("Failed to verify payment");
            }
          } catch (error) {
            console.error("Error updating booking after payment:", error);
            toast.error("Payment successful but booking confirmation failed. Please contact support with payment ID: " + response.razorpay_payment_id);
          }
        },
        prefill: {
          name: `${guestDetails.firstName} ${guestDetails.lastName}`,
          email: guestDetails.email,
          contact: guestDetails.phone
        },
        notes: {
          hotel_id: hotelId,
          booking_id: createdBooking.id,
          booking_reference: createdBooking.booking_reference || createdBooking.bookingReference
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment window closed. Your booking is pending payment.');
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      
      razorpay.open();
      return true;
    } catch (error) {
      console.error('Payment initialization error:', error);
      const { toast } = await import('react-toastify');
      toast.error('Failed to initialize payment. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      
      // Generate unique booking reference
      const bookingReference = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Convert dates to ISO format with time
      const checkInDateTime = new Date(checkin + 'T14:00:00').toISOString();
      const checkOutDateTime = new Date(checkout + 'T11:00:00').toISOString();
      
      let finalRoomId = roomId ? parseInt(roomId) : null;
      
      if (!finalRoomId) {
        try {
          const roomsResponse = await API.hotels.getRoomsByHotel(hotelId);
          if (roomsResponse && roomsResponse.data && roomsResponse.data.length > 0) {
            finalRoomId = roomsResponse.data[0].id;
          }
        } catch (error) {
          console.error("Failed to fetch rooms:", error);
        }
      }
      
      if (!finalRoomId) {
        toast.error("No rooms available for this hotel.");
        setLoading(false);
        return;
      }
      
      // Step 1: Create the booking in "pending" status first
      const bookingData = {
        booking_reference: bookingReference,
        hotel_id: parseInt(hotelId),
        room_id: finalRoomId,
        guest_name: `${guestDetails.firstName} ${guestDetails.lastName}`,
        guest_email: guestDetails.email,
        guest_phone: guestDetails.phone,
        check_in_date: checkInDateTime,
        check_out_date: checkOutDateTime,
        number_of_nights: nights,
        number_of_guests: adults + children,
        room_price: roomPrice,
        extra_persons: Math.max(0, (adults + children) - 2),
        extra_person_price: 0,
        total_amount: subtotal,
        tax_amount: taxes,
        discount_amount: 0,
        final_amount: total,
        booking_status: 'pending', // Initial status
        payment_status: 'pending', // Initial status
        special_requests: guestDetails.specialRequests || ''
      };

      console.log("Creating pending booking:", bookingData);
      
      const createResponse = await API.hotels.createBooking(bookingData);
      
      if (createResponse && createResponse.data) {
        console.log("Booking created successfully, status: pending. ID:", createResponse.data.id);
        
        // Step 2: Now initiate Razorpay payment with the created booking ID
        await handlePayment(createResponse.data);
      } else {
        throw new Error("Failed to create booking record");
      }
      
    } catch (error) {
      console.error("=== Booking Error Details ===");
      console.error("Error object:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error status:", error.status);
      console.error("Error data:", error.data);
      console.error("===========================");
      

      
      
      // Try to get the most specific error message
      let errorMsg = "Failed to create booking. Please try again.";
      
      // Check error.data (ApiError format)
      if (error.data) {
        if (typeof error.data === 'string') {
          errorMsg = error.data;
        } else if (error.data.error) {
          errorMsg = error.data.error;
        } else if (error.data.message) {
          errorMsg = error.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
 

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Guest Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-32 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex-shrink-0 overflow-hidden">
                    {hotelImage ? (
                      <img
                        src={hotelImage}
                        alt={hotelName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-2xl font-bold">' + hotelName.charAt(0) + '</div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                        {hotelName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Hotel Details */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{hotelName}</h2>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span>{location}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Check In</div>
                    <div className="font-semibold">{formatDate(checkin)}</div>
                    <div className="text-sm text-gray-600">12 PM</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Check Out</div>
                    <div className="font-semibold">{formatDate(checkout)}</div>
                    <div className="text-sm text-gray-600">11 AM</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Guests</div>
                    <div className="font-semibold">
                      {nights} Night{nights !== 1 ? 's' : ''} | {adults} Adult{adults !== 1 ? 's' : ''} | {rooms} Room{rooms !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Room Details */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">{roomName}</h3>
                  <div className="text-sm text-gray-600 mb-2">{adults} Adults</div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="w-4 h-4 text-green-600" />
                      Room With Free Cancellation
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="w-4 h-4 text-green-600" />
                      No meals included
                    </li>
                  </ul>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
          
                    <div>
                      <h4 className="font-semibold text-blue-900">Free Cancellation till 24 hrs before check in</h4>
                      <p className="text-sm text-blue-700">
                        Complete payment to confirm your booking. Full refund available if cancelled before 24 hours of check-in.
                      </p>
                    </div>
                  </div>

                  {/* Cancellation Timeline */}
                  <div className="relative">
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-center flex-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                        <div className="font-medium">NOW</div>
                        <div className="text-gray-600">Complete Payment</div>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-yellow-500"></div>
                      <div className="text-center flex-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                        <div className="font-medium">24 hrs before</div>
                        <div className="text-gray-600">Check-in</div>
                        <div className="text-gray-500">Free cancellation</div>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-yellow-500 to-red-500"></div>
                      <div className="text-center flex-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                        <div className="font-medium">Check-in</div>
                        <div className="text-gray-600">{formatDate(checkin)}</div>
                        <div className="text-gray-500">12:00 PM</div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        100% Refund
                      </span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                        Non Refundable
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaUser className="w-5 h-5 text-blue-600" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={guestDetails.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={guestDetails.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={guestDetails.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          name="phone"
                          value={guestDetails.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={guestDetails.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special requests or preferences..."
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Free Cancellation</h4>
                    <p className="text-sm text-gray-600">Cancel up to 24 hours before check-in for a full refund</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Secure Payment</h4>
                    <p className="text-sm text-gray-600">Pay securely using Razorpay - Cards, UPI, Net Banking & more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Instant Confirmation</h4>
                    <p className="text-sm text-gray-600">Receive booking confirmation immediately after payment via email</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-medium">₹{roomPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{rooms} Room{rooms !== 1 ? 's' : ''}</span>
                    <span className="font-medium">₹{roomPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">- ₹0</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Service Fees</span>
                    <span className="font-medium">₹{taxes.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>

            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Have a Coupon Code?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
