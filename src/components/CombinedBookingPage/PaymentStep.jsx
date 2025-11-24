"use client";

import React, { useState, useEffect } from "react";
import BASE_URL from "@/baseUrl/baseUrl";
import API from "@/services/api";
import { 
  FaPlane, 
  FaClock, 
  FaUserFriends, 
  FaCreditCard, 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";

// Add missing chair icon as a simple component
const FaChair = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
  </svg>
);

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

export default function PaymentStep({
  bookingData,
  travelerDetails,
  handlePreviousStep,
  onConfirm,
  isAdmin,
  isAgent,
  selectedSeats = [],
  onChangeSeats,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(["S2", "S3", "S4", "S5", "S6"]); // Default to F1 flight seats
  const [bookedSeats, setBookedSeats] = useState([]); // Track booked/occupied seats
  const [allSeats, setAllSeats] = useState([]); // All possible seats for this flight
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const router = useRouter();
  const token = localStorage.getItem("token");

  // Log seats for debugging
  useEffect(() => {
    console.log('PaymentStep: Received selectedSeats from parent:', selectedSeats);
  }, [selectedSeats]);

  // Log auth state for debugging

  // For demo purposes, allow access without token
  // if (!token) {
  //   alert("Authentication error: please log in again.");
  //   router.push("/sign-in");
  //   return null;
  // }

  // Check for Razorpay key (only for non-admin)
  if (!RAZORPAY_KEY && !isAdmin) {
    setError("Payment configuration missing. Please contact support.");
    return null;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const totalPassengers = travelerDetails.length;
  const userId = authState.user?.id;

  // For demo purposes, use default userId if missing
  const finalUserId = userId || 1;

  // Fetch available and booked seats
  useEffect(() => {
    async function fetchSeats() {
      try {
        if (!bookingData.id || !bookingData.selectedDate) {
          console.warn("Invalid booking data:", { 
            id: bookingData.id, 
            selectedDate: bookingData.selectedDate,
            fullBookingData: bookingData 
          });
          
          // For demo purposes, show F1 flight seats directly
          console.log("Using demo F1 flight seats - S1 booked, S2-S6 available");
          setAllSeats(["S1", "S2", "S3", "S4", "S5", "S6"]);
          setAvailableSeats(["S2", "S3", "S4", "S5", "S6"]);
          setBookedSeats(["S1"]);
          setError(null);
          return;
        }
        
        if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingData.selectedDate)) {
          console.error("Invalid date format:", bookingData.selectedDate);
          throw new Error(`Invalid date format: ${bookingData.selectedDate}. Expected YYYY-MM-DD`);
        }
        
        // Determine if this is a helicopter booking
        const isHelicopterBooking = bookingData.bookingType === 'helicopter' || 
                                   bookingData.type === 'helicopter';
        
        const apiEndpoint = isHelicopterBooking 
          ? `${BASE_URL}/helicopter-seat/available-seats?schedule_id=${bookingData.id}&bookDate=${bookingData.selectedDate}`
          : `${BASE_URL}/booked-seat/available-seats?schedule_id=${bookingData.id}&bookDate=${bookingData.selectedDate}`;
        
        console.log('Fetching seats from:', apiEndpoint);

        const resp = await fetch(apiEndpoint, { headers });
        if (!resp.ok) {
          const errorText = await resp.text();
          console.error('Seat API error:', errorText);
          throw new Error(`Failed to fetch seats: ${resp.status} ${resp.statusText}`);
        }
        const data = await resp.json();
        console.log('Seat API response:', data);
        
        if (!Array.isArray(data.availableSeats)) {
          throw new Error("Invalid seat data received");
        }
        
        // Extract available seats from response
        const available = data.availableSeats || [];
        
        // Get booked seats from response, or calculate from total seats
        let booked = data.bookedSeats || [];
        let all = [];
        
        if (data.totalSeats && Array.isArray(data.totalSeats)) {
          // If API provides total seats, use that
          all = data.totalSeats;
          // Calculate booked seats as difference
          booked = all.filter(seat => !available.includes(seat));
        } else if (booked.length > 0) {
          // If API provides booked seats, combine with available
          all = [...new Set([...available, ...booked])];
        } else {
          // Fallback: Generate seat list based on available seats
          // Assume seats are numbered sequentially (S1, S2, S3, etc.)
          const maxSeatNum = available.reduce((max, seat) => {
            const num = parseInt(seat.replace(/\D/g, ''));
            return num > max ? num : max;
          }, 0);
          
          // Generate all seats from S1 to max
          all = [];
          for (let i = 1; i <= Math.max(maxSeatNum, 6); i++) {
            all.push(`S${i}`);
          }
          
          // Calculate booked seats
          booked = all.filter(seat => !available.includes(seat));
        }
        
        // Sort all seats
        all.sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, ''));
          const numB = parseInt(b.replace(/\D/g, ''));
          return numA - numB;
        });
        
        console.log('Processed seats:', { all, available, booked });
        
        // If no seats data, use fallback
        if (all.length === 0) {
          console.warn("No seats returned from API, generating fallback seats");
          const seatCount = Math.min(totalPassengers * 3, 10);
          const fallbackSeats = [];
          for (let i = 1; i <= seatCount; i++) {
            fallbackSeats.push(`S${i}`);
          }
          setAllSeats(fallbackSeats);
          setAvailableSeats(fallbackSeats);
          setBookedSeats([]);
        } else {
          setAllSeats(all);
          setAvailableSeats(available);
          setBookedSeats(booked);
        }
        
        // Filter selected seats to only include available ones
        if (onChangeSeats) {
          const validSeats = selectedSeats.filter((seat) => available.includes(seat)).slice(0, totalPassengers);
          if (validSeats.length !== selectedSeats.length) {
            console.log('Clearing invalid seat selections:', selectedSeats.filter(s => !available.includes(s)));
            onChangeSeats(validSeats);
          }
        }
        setError(null);
      } catch (err) {
        console.error("Seat API failed:", err.message);
        console.log("Booking data that caused error:", bookingData);
        
        // Fallback: Generate default seats if API fails
        const seatCount = Math.min(totalPassengers * 3, 10);
        const fallbackSeats = [];
        for (let i = 1; i <= seatCount; i++) {
          fallbackSeats.push(`S${i}`);
        }
        setAllSeats(fallbackSeats);
        setAvailableSeats(fallbackSeats);
        setBookedSeats([]);
        setError(null); // Clear error since we have fallback seats
      }
    }
    fetchSeats();
  }, [bookingData.id, bookingData.selectedDate, totalPassengers]);

  // WebSocket for real-time seat updates
  useEffect(() => {
    let socket;
    let retryCount = 0;
    const maxRetries = 3;

    const connectSocket = () => {
      import("socket.io-client")
        .then(({ io }) => {
          socket = io(BASE_URL, {
            transports: ["websocket", "polling"],
            reconnectionAttempts: maxRetries,
            auth: { token },
          });
          socket.on("connect", () => {
            retryCount = 0;
          });
          socket.on("seats-updated", ({ schedule_id, bookDate, availableSeats, bookedSeats }) => {
            if (
              schedule_id === Number(bookingData.id) &&
              bookDate === bookingData.selectedDate &&
              Array.isArray(availableSeats)
            ) {
              const available = availableSeats || [];
              const booked = bookedSeats || [];
              const all = [...new Set([...available, ...booked])].sort((a, b) => {
                const numA = parseInt(a.replace(/\D/g, ''));
                const numB = parseInt(b.replace(/\D/g, ''));
                return numA - numB;
              });
              
              setAllSeats(all);
              setAvailableSeats(available);
              setBookedSeats(booked);
              
              // Filter selected seats via parent callback
              if (onChangeSeats) {
                const validSeats = selectedSeats.filter((seat) => available.includes(seat)).slice(0, totalPassengers);
                if (validSeats.length !== selectedSeats.length) {
                  console.log('WebSocket: Clearing invalid seat selections');
                  onChangeSeats(validSeats);
                }
              }
              setError(null);
            }
          });
          socket.on("connect_error", (err) => {
            if (retryCount < maxRetries) {
              retryCount++;
            } else {
              setError("Real-time seat updates unavailable. Please refresh to see latest seats.");
            }
          });
          socket.on("error", (err) => {
            setError("Real-time seat updates failed. Please refresh.");
          });
        })
        .catch((err) => {
          setError("Real-time seat updates unavailable. Please refresh to see latest seats.");
        });
    };

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [bookingData.id, bookingData.selectedDate, totalPassengers, token]);

  // Load Razorpay script
  async function loadRazorpay() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Handle booking and payment
async function validateAgentId(userId) {
  try {
    const response = await fetch(`${BASE_URL}/agents/${userId}`, { headers });
    if (!response.ok) {
      return null;
    }
    return userId;
  } catch (err) {
    return null;
  }
}

async function handleBooking() {
  if (selectedSeats.length !== totalPassengers) {
    alert(`Please select exactly ${totalPassengers} seat(s).`);
    return;
  }
  if (availableSeats.length < totalPassengers) {
    alert("Not enough seats available. Please select another flight.");
    return;
  }

  const totalPrice = parseFloat(bookingData.totalPrice);
  if (!isFinite(totalPrice) || totalPrice <= 0) {
    setError("Invalid total price. Please try again.");
    return;
  }

  // Validate travelerDetails
  if (!travelerDetails[0]?.phone || !travelerDetails[0]?.email || !travelerDetails[0]?.fullName) {
    setError("Missing traveler information. Please go back and fill in all details.");
    return;
  }

  // Validate bookingData
  if (!bookingData.id || !bookingData.selectedDate) {
    setError("Missing flight schedule or date. Please select a flight.");
    return;
  }

  // CRITICAL: Validate token before initiating payment
  // This prevents the scenario where payment succeeds but booking fails due to expired token
  try {
    console.log('[PaymentStep] Validating authentication token before payment...');
    await API.users.getProfile();
    console.log('[PaymentStep] Token validation successful');
  } catch (tokenError) {
    console.error('[PaymentStep] Token validation failed:', tokenError);
    
    // Check if it's an authentication error
    const isAuthError = tokenError?.status === 401 || 
                       tokenError?.status === 403 ||
                       tokenError?.message?.toLowerCase().includes('unauthorized') ||
                       tokenError?.message?.toLowerCase().includes('invalid token');
    
    if (isAuthError) {
      // Clear auth state
      localStorage.removeItem("token");
      localStorage.removeItem("authState");
      
      // Show user-friendly error
      alert(
        "Your session has expired. Please log in again to complete your booking.\n\n" +
        "Don't worry - your booking details have been saved and will be restored after you log in."
      );
      
      // Redirect to login with return URL
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/sign-in?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    } else {
      // Network or other error - show warning but allow to continue
      console.warn('[PaymentStep] Non-auth error during token validation, proceeding with caution');
      setError("Warning: Unable to verify session. If payment fails, please try logging in again.");
      // Continue with booking attempt
    }
  }

  setIsProcessing(true);
  try {
    const amountInPaise = Math.round(totalPrice * 1); // Convert to paise
    if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
      throw new Error("Invalid payment amount");
    }

    // Fetch PNR
    async function fetchPNR() {
      try {
        const response = await fetch(`${BASE_URL}/bookings/generate-pnr`, { headers });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to generate PNR: ${response.status} ${errorText}`);
        }
        const { pnr } = await response.json();
        if (!pnr) {
          throw new Error("PNR not returned from server");
        }
        return pnr;
      } catch (err) {
        throw err;
      }
    }

    // Prepare payload for booking
    const payload = {
      bookedSeat: {
        bookDate: bookingData.selectedDate,
        schedule_id: Number(bookingData.id),
        booked_seat: totalPassengers,
        seat_labels: selectedSeats,
      },
      booking: {
        pnr: await fetchPNR(),
        bookingNo: `BOOK${Date.now()}`,
        contact_no: travelerDetails[0].phone,
        email_id: travelerDetails[0].email,
        noOfPassengers: totalPassengers,
        bookDate: bookingData.selectedDate,
        schedule_id: Number(bookingData.id),
        totalFare: totalPrice.toString(),
        bookedUserId: userId,
        paymentStatus: isAdmin ? "SUCCESS" : "PENDING",
        bookingStatus: isAdmin ? "CONFIRMED" : "PENDING",
        agentId: isAgent ? await validateAgentId(userId) : null,
      },
      billing: {
        billing_name: `${travelerDetails[0].title} ${travelerDetails[0].fullName}`,
        billing_email: travelerDetails[0].email,
        billing_number: travelerDetails[0].phone,
        billing_address: travelerDetails[0].address || "",
        billing_country: "India",
        billing_state: travelerDetails[0].state || "",
        billing_pin_code: travelerDetails[0].pinCode || "",
        GST_Number: travelerDetails[0].gstNumber || null,
        user_id: userId,
      },
      payment: {
        transaction_id: `TXN${Date.now()}`,
        payment_id: isAdmin ? `ADMIN_${Date.now()}` : null,
        order_id: isAdmin ? `ADMIN_${Date.now()}` : null,
        razorpay_signature: null,
        payment_status: isAdmin ? "SUCCESS" : "PENDING",
        payment_mode: isAdmin ? "ADMIN" : "RAZORPAY",
        payment_amount: totalPrice.toString(),
        message: isAdmin ? "Admin booking (no payment required)" : "Initiating payment",
        user_id: userId,
      },
      passengers: travelerDetails.map((t, i) => ({
        title: t.title,
        name: t.fullName,
        type: i < bookingData.passengers.adults ? "Adult" : i < bookingData.passengers.adults + bookingData.passengers.children ? "Child" : "Infant",
        dob: t.dateOfBirth || null,
        age: t.dateOfBirth
          ? Math.floor((Date.now() - new Date(t.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
          : 0,
      })),
    };


    if (isAdmin) {
      // Admin booking: Skip payment
      const response = await fetch(`${BASE_URL}/bookings/complete-booking`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create admin booking: ${response.status} ${errorText}`);
      }
      const result = await response.json();
      setIsProcessing(false);
      onConfirm(result);
    } else {
      // Load Razorpay SDK
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create Razorpay order
      const orderResponse = await fetch(`${BASE_URL}/payments/create-order`, {
        method: "POST",
        headers,
        body: JSON.stringify({ amount: amountInPaise, payment_mode: "RAZORPAY" }),
      });
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(`Failed to create payment order: ${orderResponse.status} ${errorText}`);
      }
      const { order_id } = await orderResponse.json();
      payload.payment.order_id = order_id;

      // Razorpay payment options
      const options = {
        key: RAZORPAY_KEY,
        amount: amountInPaise,
        currency: "INR",
        order_id,
        name: "Flight Booking",
        description: `Flight from ${bookingData.departure} to ${bookingData.arrival}`,
        prefill: {
          name: travelerDetails[0].fullName,
          email: travelerDetails[0].email,
          contact: travelerDetails[0].phone,
        },
        handler: async (response) => {
          try {
            payload.payment.payment_id = response.razorpay_payment_id;
            payload.payment.razorpay_signature = response.razorpay_signature;
            payload.payment.payment_status = "SUCCESS";
            payload.payment.message = "Payment successful";
            payload.booking.paymentStatus = "SUCCESS";
            payload.booking.bookingStatus = "CONFIRMED";


            const bookingResponse = await fetch(`${BASE_URL}/bookings/complete-booking`, {
              method: "POST",
              headers,
              body: JSON.stringify(payload),
            });
            if (!bookingResponse.ok) {
              const errorText = await bookingResponse.text();
              // Initiate refund
              const refundResponse = await fetch(`${BASE_URL}/payments/refund`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                  payment_id: response.razorpay_payment_id,
                  amount: payload.payment.payment_amount * 100, // In paise
                }),
              });
              if (!refundResponse.ok) {
              } else {
              }
              throw new Error(`Failed to complete booking: ${bookingResponse.status} ${errorText}`);
            }
            const result = await bookingResponse.json();
            setIsProcessing(false);
            onConfirm(result);
          } catch (err) {
            setError(`Booking failed: ${err.message}`);
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError("Payment cancelled by user");
          },
        },
        theme: { color: "#1E3A8A" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
    }
  } catch (err) {
    setError(`Booking error: ${err.message}`);
    setIsProcessing(false);
  }
}
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
          <FaCreditCard className="text-green-600 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
          <p className="text-gray-600">Secure your booking with our encrypted payment system</p>
        </div>
      </div>

      {/* Error and Processing States */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-600 mr-3" />
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-blue-300 rounded animate-pulse mr-3"></div>
            <div className="text-blue-800">Processing your booking...</div>
          </div>
        </div>
      )}

      {/* Seat Selection */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaChair className="mr-2 text-blue-600" />
          Select Your Seats ({selectedSeats.length}/{totalPassengers})
        </h3>
        
        {allSeats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaSpinner className="animate-spin mx-auto mb-2 text-2xl" />
            Loading available seats...
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                  Available
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  Selected
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  Booked
                </div>
              </div>
            </div>
            
            {bookedSeats.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <FaExclamationTriangle className="inline mr-2" />
                  <strong>Note:</strong> Seats marked in red are already booked and cannot be selected.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {allSeats.map((seat) => {
                const isBooked = bookedSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);
                const isAvailable = availableSeats.includes(seat);
                
                return (
                  <button
                    key={seat}
                    className={`p-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                      isBooked
                        ? "bg-red-500 text-white border-red-500 cursor-not-allowed opacity-75"
                        : isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg hover:bg-blue-700"
                        : isAvailable
                        ? "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    }`}
                    disabled={isBooked || !isAvailable || (selectedSeats.length >= totalPassengers && !isSelected)}
                    onClick={() => {
                      if (!onChangeSeats || isBooked || !isAvailable) return;
                      if (isSelected) {
                        onChangeSeats(selectedSeats.filter((s) => s !== seat));
                      } else if (selectedSeats.length < totalPassengers) {
                        onChangeSeats([...selectedSeats, seat]);
                      }
                    }}
                    title={isBooked ? "This seat is already booked" : isSelected ? "Click to deselect" : "Click to select"}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Available seats: <strong className="text-green-600">{availableSeats.length}</strong></p>
              <p>Booked seats: <strong className="text-red-600">{bookedSeats.length}</strong></p>
            </div>
          </>
        )}
      </div>

      {/* Booking Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-700">
              <FaPlane className="mr-2 text-blue-600" />
              Route
            </span>
            <span className="font-medium">{bookingData.departure} → {bookingData.arrival}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-700">
              <FaClock className="mr-2 text-green-600" />
              Date & Time
            </span>
            <span className="font-medium">{bookingData.selectedDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-700">
              <FaUserFriends className="mr-2 text-purple-600" />
              Passengers
            </span>
            <span className="font-medium">{totalPassengers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-700">
              <FaChair className="mr-2 text-orange-600" />
              Selected Seats
            </span>
            <span className="font-medium">{selectedSeats.join(", ") || "None selected"}</span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">₹{bookingData.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Payment Security */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <FaShieldAlt className="text-green-600 mr-3" />
          <div>
            <div className="font-semibold text-green-800">Secure Payment</div>
            <div className="text-sm text-green-700">Your payment is protected by 256-bit SSL encryption</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handlePreviousStep}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
          disabled={isProcessing}
        >
          ← Back to Traveler Info
        </button>
        <button
          onClick={handleBooking}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
            isAdmin 
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              : isAgent
              ? "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700"
              : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
          }`}
          disabled={isProcessing || selectedSeats.length !== totalPassengers}
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              {isAdmin ? "Confirm Admin Booking" : isAgent ? "Process Agent Booking" : "Complete Payment"}
              {!isAdmin && " →"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}