"use client";

import BASE_URL from '@/baseUrl/baseUrl';
import { CurrencyRupeeIcon, ExclamationTriangleIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const PerSeatCancellationModal = ({ isOpen, onClose, booking, onCancellationSuccess, bookingType = 'flight' }) => {
  const [cancellationDetails, setCancellationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);

  const isHelicopter = bookingType === 'helicopter' || booking?.bookingType === 'helicopter';
  const apiPrefix = isHelicopter ? 'helicopter-cancellation' : 'cancellation';

  useEffect(() => {
    if (isOpen && booking) {
      fetchCancellationDetails();
      setSelectedSeats([]);
      setReason('');
    }
  }, [isOpen, booking]);

  const fetchCancellationDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/${apiPrefix}/details/${booking.id}`);
      const data = await response.json();
      
      if (data.success) {
        setCancellationDetails(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch cancellation details');
      }
    } catch (error) {
      toast.error('Failed to fetch cancellation details');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatToggle = (seatIndex) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatIndex)) {
        return prev.filter(i => i !== seatIndex);
      } else {
        return [...prev, seatIndex];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSeats.length === booking.passengers?.length) {
      setSelectedSeats([]);
    } else {
      setSelectedSeats(booking.passengers?.map((_, idx) => idx) || []);
    }
  };

  const calculateRefundForSelectedSeats = () => {
    if (!cancellationDetails || selectedSeats.length === 0) return { refund: 0, charges: 0 };
    
    const totalFare = parseFloat(cancellationDetails.totalFare);
    const totalPassengers = booking.noOfPassengers || booking.passengers?.length || 1;
    const farePerSeat = totalFare / totalPassengers;
    
    const cancellationChargesPerSeat = parseFloat(cancellationDetails.cancellationCharges) / totalPassengers;
    const refundPerSeat = farePerSeat - cancellationChargesPerSeat;
    
    return {
      farePerSeat: farePerSeat.toFixed(2),
      chargesPerSeat: cancellationChargesPerSeat.toFixed(2),
      refundPerSeat: refundPerSeat.toFixed(2),
      totalFare: (farePerSeat * selectedSeats.length).toFixed(2),
      totalCharges: (cancellationChargesPerSeat * selectedSeats.length).toFixed(2),
      totalRefund: (refundPerSeat * selectedSeats.length).toFixed(2)
    };
  };

  const handleCancellation = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to cancel');
      return;
    }

    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      
      // Get passenger IDs for selected seats
      const passengerIds = selectedSeats.map(idx => booking.passengers[idx]?.id).filter(Boolean);
      
      const response = await fetch(`${BASE_URL}/${apiPrefix}/cancel-seats/${booking.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ 
          reason,
          passengerIds,
          seatIndices: selectedSeats
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const seatCount = selectedSeats.length;
        toast.success(`${seatCount} seat${seatCount > 1 ? 's' : ''} cancelled successfully`);
        onCancellationSuccess(data.data);
        onClose();
      } else {
        toast.error(data.error || 'Failed to cancel seats');
      }
    } catch (error) {
      toast.error('Failed to cancel seats');
    } finally {
      setCancelling(false);
    }
  };

  if (!isOpen) return null;

  const refundCalculation = calculateRefundForSelectedSeats();
  const passengers = booking?.passengers || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cancel Seats</h2>
              <p className="text-sm text-gray-500">PNR: {booking?.pnr} • Select seats to cancel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cancellationDetails ? (
            <div className="space-y-6">
              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">PNR:</span>
                    <span className="ml-2 font-medium">{cancellationDetails.pnr}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Booking No:</span>
                    <span className="ml-2 font-medium">{cancellationDetails.bookingNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Fare:</span>
                    <span className="ml-2 font-medium">₹{cancellationDetails.totalFare}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Passengers:</span>
                    <span className="ml-2 font-medium">{booking.noOfPassengers}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Applicable Policy</h3>
                <p className="text-blue-800 text-sm mb-1">{cancellationDetails.policyTier}</p>
                <p className="text-blue-700 text-xs">
                  Time remaining: {cancellationDetails.hoursBeforeDeparture} hours before departure
                </p>
                <p className="text-blue-700 text-xs mt-2">
                  Cancellation charge per seat: ₹{refundCalculation.chargesPerSeat}
                </p>
              </div>

              {/* Passenger Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    Select Passengers to Cancel
                  </h3>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedSeats.length === passengers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="space-y-2">
                  {passengers.map((passenger, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSeats.includes(idx)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSeats.includes(idx)}
                        onChange={() => handleSeatToggle(idx)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{passenger.name || `Passenger ${idx + 1}`}</div>
                        <div className="text-sm text-gray-500">
                          {passenger.age && `Age: ${passenger.age}`}
                          {passenger.gender && ` • ${passenger.gender}`}
                          {booking.seatLabels?.[idx] && ` • Seat: ${booking.seatLabels[idx]}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">₹{refundCalculation.farePerSeat}</div>
                        <div className="text-xs text-gray-500">Fare</div>
                      </div>
                    </label>
                  ))}
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{selectedSeats.length}</strong> seat{selectedSeats.length > 1 ? 's' : ''} selected for cancellation
                    </p>
                  </div>
                )}
              </div>

              {/* Refund Breakdown */}
              {selectedSeats.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CurrencyRupeeIcon className="w-5 h-5 text-green-600" />
                    Refund Breakdown for Selected Seats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Seats Selected:</span>
                      <span className="font-medium">{selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Fare for Selected Seats:</span>
                      <span className="font-medium">₹{refundCalculation.totalFare}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cancellation Charges:</span>
                      <span className="font-medium text-red-600">-₹{refundCalculation.totalCharges}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total Refund Amount:</span>
                        <span className="font-bold text-green-600 text-lg">
                          ₹{refundCalculation.totalRefund}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Refund Notice */}
              {selectedSeats.length > 0 && parseFloat(refundCalculation.totalRefund) > 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>Refund Process:</strong> Your refund will be processed within 7-10 business days 
                    and credited to your original payment method.
                  </p>
                </div>
              ) : selectedSeats.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    <strong>No Refund:</strong> As per our cancellation policy, no refund is applicable 
                    for cancellations made less than 24 hours before departure.
                  </p>
                </div>
              ) : null}

              {/* Cancellation Reason */}
              {cancellationDetails.canCancel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Cancellation *
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a reason for cancellation..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    required
                  />
                </div>
              )}

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 text-sm font-medium">Important Notice</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      This action cannot be undone. Selected seats will be cancelled and cannot be reactivated.
                      {selectedSeats.length < passengers.length && ' The remaining seats will stay active.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to load cancellation details
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedSeats.length > 0 && (
              <span>
                Cancelling <strong>{selectedSeats.length}</strong> of <strong>{passengers.length}</strong> seat{passengers.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={cancelling}
            >
              Cancel
            </button>
            {cancellationDetails?.canCancel && (
              <button
                onClick={handleCancellation}
                disabled={cancelling || !reason.trim() || selectedSeats.length === 0}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {cancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  `Confirm Cancellation (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerSeatCancellationModal;
