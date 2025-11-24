
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const PassengerSelection = ({ selectedSlot, onSubmit, userId, showPopup }) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    passengers: [{ name: '', weight: '' }],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setIsRazorpayLoaded(true);
      };
      script.onerror = () => {
        setIsRazorpayLoaded(false);
        showPopup('Failed to load payment system. Please try again.', true);
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    loadRazorpayScript();
  }, [showPopup]);

  // Update passengers array when passengerCount changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      passengers: Array.from({ length: passengerCount }, (_, i) =>
        prev.passengers[i] || { name: '', weight: '' }
      ),
    }));
  }, [passengerCount]);

  // Calculate total price
  const calculatedTotalPrice = useMemo(() => {
    if (!selectedSlot || !selectedSlot.price) return 0;
    const basePrice = selectedSlot.price * passengerCount;
    const extraWeightCharges = formData.passengers.reduce((total, passenger) => {
      const weight = parseFloat(passenger.weight) || 0;
      return total + (weight > 75 ? (weight - 75) * 500 : 0);
    }, 0);
    return basePrice + extraWeightCharges;
  }, [passengerCount, formData.passengers, selectedSlot?.price]);

  useEffect(() => {
    setTotalPrice(calculatedTotalPrice);
  }, [calculatedTotalPrice]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('passenger')) {
      const field = name.split('-')[1];
      const updatedPassengers = [...formData.passengers];
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
      setFormData({ ...formData, passengers: updatedPassengers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Initiate Razorpay order and open payment modal
  const initiatePayment = async (bookingId) => {
    try {
      if (!isRazorpayLoaded || !window.Razorpay) {
        throw new Error('Payment system not loaded. Please try again.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/sign-in');
        throw new Error('Please sign in to confirm your booking.');
      }

      // Call backend to create Razorpay order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: totalPrice, payment_mode: 'RAZORPAY' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create order');

      const { order_id } = result;

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'Flyola Aviation',
        description: 'Joyride Booking Payment',
        order_id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                booking_id: bookingId,
                user_id: userId,
                payment_amount: totalPrice,
              }),
            });
            const verifyResult = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verifyResult.error || 'Payment verification failed');

            // Notify parent component
            onSubmit({ ...formData, totalPrice, bookingId, payment: verifyResult.payment });
          } catch (err) {
            showPopup('Payment verification failed: ' + err.message, true);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#2563EB' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () => {
        setLoading(false);
        showPopup('Payment failed. Please try again.', true);
      });
      razorpay.open();
    } catch (err) {
      setLoading(false);
      showPopup(err.message, true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || passengerCount < 1 || passengerCount > selectedSlot.seats) {
      showPopup(`Please fill all fields and ensure 1-${selectedSlot.seats} passengers.`, true);
      return;
    }
    for (let i = 0; i < passengerCount; i++) {
      if (!formData.passengers[i].name || !formData.passengers[i].weight) {
        showPopup('Please fill all passenger details.', true);
        return;
      }
      const weight = parseFloat(formData.passengers[i].weight);
      if (isNaN(weight) || weight <= 0) {
        showPopup(`Please enter a valid weight for passenger ${i + 1}.`, true);
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        showPopup('Please sign in to confirm your booking.', true);
        router.push('/sign-in');
        return;
      }

      const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots/joyride-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          email: formData.email,
          phone: formData.phone,
          passengers: formData.passengers,
          totalPrice,
        }),
      });
      const bookingResult = await bookingResponse.json();
      if (!bookingResponse.ok) throw new Error(bookingResult.error || 'Failed to create booking');

      await initiatePayment(bookingResult.booking.id);
    } catch (err) {
      setLoading(false);
      showPopup('Booking creation failed: ' + err.message, true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-blue-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">👥✈️</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Who's Flying Today? 🎉
        </h2>
        <p className="text-gray-600">
          Let's get your sky adventure details ready!
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <div className={`w-12 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
        </div>
      </div>

      {/* Important Info Card */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📋</div>
          <div>
            <h3 className="font-bold text-yellow-800 mb-2">Flight Guidelines ✨</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Maximum {selectedSlot.seats} passengers per flight</li>
              <li>• Weight limit: 70-75 kg per person (₹500/kg extra for over 75kg)</li>
              <li>• Please arrive 15 minutes before your scheduled time</li>
              <li>• Bring a valid ID for all passengers</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Passenger Count */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🎫</div>
            <h3 className="text-xl font-bold text-gray-900">How Many Adventurers?</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].slice(0, selectedSlot.seats).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setPassengerCount(count);
                  setCurrentStep(2);
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${passengerCount === count
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                disabled={loading}
              >
                <div className="text-2xl mb-2">
                  {count === 1 ? '👤' : count === 2 ? '👥' : count === 3 ? '👨‍👩‍👧' : '👨‍👩‍👧‍👦'}
                </div>
                <div className="font-semibold">{count} {count === 1 ? 'Person' : 'People'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Contact Information */}
        {currentStep >= 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl">📞</div>
              <h3 className="text-xl font-bold text-gray-900">Contact Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (e.target.value && formData.phone) setCurrentStep(3);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📱 Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (e.target.value && formData.email) setCurrentStep(3);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="+91 XXXXX XXXXX"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Passenger Details */}
        {currentStep >= 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl">✈️</div>
              <h3 className="text-xl font-bold text-gray-900">Passenger Information</h3>
            </div>

            <div className="space-y-6">
              {formData.passengers.map((passenger, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">
                      {index === 0 ? '🧑‍✈️' : index === 1 ? '👩‍✈️' : index === 2 ? '🧒' : '👶'}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      Passenger {index + 1} {index === 0 && '(Lead Passenger)'}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        👤 Full Name
                      </label>
                      <input
                        type="text"
                        name={`passenger-name-${index}`}
                        value={passenger.name}
                        onChange={(e) => handleInputChange(e, index)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter full name"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ⚖️ Weight (kg)
                      </label>
                      <input
                        type="number"
                        name={`passenger-weight-${index}`}
                        value={passenger.weight}
                        onChange={(e) => handleInputChange(e, index)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Weight in kg"
                        required
                        min="1"
                        step="0.1"
                        disabled={loading}
                      />
                      {passenger.weight && parseFloat(passenger.weight) > 75 && (
                        <p className="text-sm text-orange-600 mt-1">
                          ⚠️ Extra charge: ₹{((parseFloat(passenger.weight) - 75) * 500).toFixed(0)} for excess weight
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Summary */}
        {currentStep >= 3 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">💰</div>
              <h3 className="text-xl font-bold text-gray-900">Price Summary</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Base Price ({passengerCount} passenger{passengerCount > 1 ? 's' : ''})</span>
                <span className="font-semibold">₹{(selectedSlot.price * passengerCount).toLocaleString('en-IN')}</span>
              </div>

              {formData.passengers.some(p => parseFloat(p.weight) > 75) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Extra Weight Charges</span>
                  <span className="font-semibold text-orange-600">
                    +₹{formData.passengers.reduce((total, passenger) => {
                      const weight = parseFloat(passenger.weight) || 0;
                      return total + (weight > 75 ? (weight - 75) * 500 : 0);
                    }, 0).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="border-t border-green-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{isNaN(totalPrice) ? '0' : totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {currentStep >= 3 && (
          <div className="text-center">
            <button
              type="submit"
              className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${loading || !isRazorpayLoaded
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              disabled={loading || !isRazorpayLoaded}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Your Adventure...
                </span>
              ) : !isRazorpayLoaded ? (
                '🔄 Loading Payment System...'
              ) : (
                '🚁 Confirm & Pay for Your Sky Adventure!'
              )}
            </button>

            {!loading && isRazorpayLoaded && (
              <p className="text-sm text-gray-500 mt-3">
                🔒 Secure payment powered by Razorpay
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default PassengerSelection;
