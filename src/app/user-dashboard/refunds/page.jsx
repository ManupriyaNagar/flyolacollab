"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import BASE_URL from "@/baseUrl/baseUrl";
import { 
  CurrencyRupeeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserRefundsPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authState.isLoading && !authState.isLoggedIn) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn) return;
    fetchUserRefunds();
  }, [authState]);

  const fetchUserRefunds = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please sign in again.");

      const res = await fetch(`${BASE_URL}/cancellation/refunds`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: Failed to fetch refunds`);
      }

      setRefunds(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PROCESSED':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'NOT_APPLICABLE':
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PROCESSED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NOT_APPLICABLE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'PROCESSED':
        return 'Processed';
      case 'PENDING':
        return 'Pending';
      case 'REJECTED':
        return 'Rejected';
      case 'NOT_APPLICABLE':
        return 'Not Applicable';
      default:
        return status;
    }
  };

  if (authState.isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your refunds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Refunds</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchUserRefunds}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Refunds</h1>
          </div>
          <p className="text-gray-600">Track your refund requests and status</p>
        </div>

        {refunds.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <CurrencyRupeeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Refunds Found</h3>
            <p className="text-gray-600 mb-6">You haven't requested any refunds yet.</p>
            <button 
              onClick={() => router.push('/user-dashboard/bookings')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Bookings
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {refunds.map((refund) => (
              <div key={refund.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Refund Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Refund #{refund.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          PNR: {refund.Booking?.pnr || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(refund.refund_status)}`}>
                      {getStatusIcon(refund.refund_status)}
                      <span className="text-sm font-medium">{getStatusText(refund.refund_status)}</span>
                    </div>
                  </div>

                  {/* Refund Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CurrencyRupeeIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Original Amount</p>
                        <p className="font-medium text-gray-900">₹{refund.original_amount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-xs text-gray-500">Cancellation Charges</p>
                        <p className="font-medium text-red-600">₹{refund.cancellation_charges}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Refund Amount</p>
                        <p className="font-medium text-green-600">₹{refund.refund_amount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <ClockIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Hours Before Departure</p>
                        <p className="font-medium text-blue-600">{refund.hours_before_departure || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Refund Reason */}
                  {refund.refund_reason && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-800 font-medium">Refund Reason</p>
                          <p className="text-blue-700 text-sm mt-1">{refund.refund_reason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {refund.admin_notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-800 font-medium">Admin Notes</p>
                          <p className="text-yellow-700 text-sm mt-1">{refund.admin_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Information */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Requested:</span>
                        <span className="ml-2 font-medium">
                          {new Date(refund.requested_at).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {refund.processed_at && (
                        <div>
                          <span className="text-gray-500">Processed:</span>
                          <span className="ml-2 font-medium">
                            {new Date(refund.processed_at).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Processing Timeline */}
                  {refund.refund_status === 'PENDING' && refund.refund_amount > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Processing Time:</strong> Your refund is being processed and will be credited 
                        to your original payment method within 7-10 business days.
                      </p>
                    </div>
                  )}

                  {refund.refund_status === 'APPROVED' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Refund Approved:</strong> Your refund has been approved and will be processed shortly.
                      </p>
                    </div>
                  )}

                  {refund.refund_status === 'PROCESSED' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Refund Processed:</strong> Your refund has been processed and credited to your account.
                      </p>
                    </div>
                  )}

                  {refund.refund_status === 'NOT_APPLICABLE' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-800 text-sm">
                        <strong>No Refund:</strong> As per our cancellation policy, no refund is applicable for this booking.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refund Policy Link */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push('/refund')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View Refund Policy →
          </button>
        </div>
      </div>
    </div>
  );
}