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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from "@/lib/utils";

export default function UserRefundsPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [refunds, setRefunds] = useState([]);
  const [helicopterRefunds, setHelicopterRefunds] = useState([]);
  const [activeTab, setActiveTab] = useState('flight'); // 'flight' or 'helicopter'
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

      // Fetch flight refunds
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

      // Fetch helicopter refunds
      try {
        const heliRes = await fetch(`${BASE_URL}/helicopter-cancellation/refunds`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (heliRes.ok) {
          const heliData = await heliRes.json();
          setHelicopterRefunds(heliData.data || []);
        } else {
          setHelicopterRefunds([]);
        }
      } catch (heliErr) {
        console.warn('Failed to fetch helicopter refunds:', heliErr);
        setHelicopterRefunds([]);
      }

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
        return <CheckCircleIcon className={cn('w-5', 'h-5', 'text-green-600')} />;
      case 'PENDING':
        return <ClockIcon className={cn('w-5', 'h-5', 'text-yellow-600')} />;
      case 'REJECTED':
        return <XCircleIcon className={cn('w-5', 'h-5', 'text-red-600')} />;
      case 'NOT_APPLICABLE':
        return <ExclamationTriangleIcon className={cn('w-5', 'h-5', 'text-gray-600')} />;
      default:
        return <ClockIcon className={cn('w-5', 'h-5', 'text-gray-600')} />;
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
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('w-12', 'h-12', 'border-4', 'border-blue-500', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600">Loading your refunds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className={cn('text-center', 'p-8')}>
          <ExclamationTriangleIcon className={cn('w-16', 'h-16', 'text-red-500', 'mx-auto', 'mb-4')} />
          <h2 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-2')}>Error Loading Refunds</h2>
          <p className={cn('text-red-600', 'mb-4')}>{error}</p>
          <button 
            onClick={fetchUserRefunds}
            className={cn('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={cn('p-6', 'lg:p-8')}>
        {/* Header */}
        <div className="mb-8">
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-2')}>
            <div className={cn('p-2', 'bg-green-100', 'rounded-lg')}>
              <CurrencyRupeeIcon className={cn('w-6', 'h-6', 'text-green-600')} />
            </div>
            <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900')}>My Refunds</h1>
          </div>
          <p className="text-gray-600">Track your refund requests and status</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-gray-200', 'p-2', 'inline-flex', 'gap-2')}>
            <button
              onClick={() => setActiveTab('flight')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'flight'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✈️ Flight Refunds ({refunds.length})
            </button>
            <button
              onClick={() => setActiveTab('helicopter')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'helicopter'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🚁 Helicopter Refunds ({helicopterRefunds.length})
            </button>
          </div>
        </div>

        {(activeTab === 'flight' ? refunds : helicopterRefunds).length === 0 ? (
          <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-gray-200', 'p-12', 'text-center')}>
            <CurrencyRupeeIcon className={cn('w-16', 'h-16', 'text-gray-300', 'mx-auto', 'mb-4')} />
            <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-2')}>No Refunds Found</h3>
            <p className={cn('text-gray-600', 'mb-6')}>You haven't requested any refunds yet.</p>
            <button 
              onClick={() => router.push('/user-dashboard/bookings')}
              className={cn('px-6', 'py-3', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
            >
              View My Bookings
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {(activeTab === 'flight' ? refunds : helicopterRefunds).map((refund) => (
              <div key={refund.id} className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-gray-200', 'overflow-hidden')}>
                <div className="p-6">
                  {/* Refund Header */}
                  <div className={cn('flex', 'items-center', 'justify-between', 'mb-4')}>
                    <div className={cn('flex', 'items-center', 'gap-4')}>
                      <div className={cn('p-3', 'bg-green-100', 'rounded-xl')}>
                        <CurrencyRupeeIcon className={cn('w-6', 'h-6', 'text-green-600')} />
                      </div>
                      <div>
                        <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
                          Refund #{refund.id}
                        </h3>
                        <p className={cn('text-sm', 'text-gray-500')}>
                          PNR: {refund.Booking?.pnr || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(refund.refund_status)}`}>
                      {getStatusIcon(refund.refund_status)}
                      <span className={cn('text-sm', 'font-medium')}>{getStatusText(refund.refund_status)}</span>
                    </div>
                  </div>

                  {/* Refund Details Grid */}
                  <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4', 'mb-6')}>
                    <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-gray-50', 'rounded-lg')}>
                      <CurrencyRupeeIcon className={cn('w-5', 'h-5', 'text-gray-600')} />
                      <div>
                        <p className={cn('text-xs', 'text-gray-500')}>Original Amount</p>
                        <p className={cn('font-medium', 'text-gray-900')}>₹{refund.original_amount}</p>
                      </div>
                    </div>

                    <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-red-50', 'rounded-lg')}>
                      <XCircleIcon className={cn('w-5', 'h-5', 'text-red-600')} />
                      <div>
                        <p className={cn('text-xs', 'text-gray-500')}>Cancellation Charges</p>
                        <p className={cn('font-medium', 'text-red-600')}>₹{refund.cancellation_charges}</p>
                      </div>
                    </div>

                    <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-green-50', 'rounded-lg')}>
                      <CheckCircleIcon className={cn('w-5', 'h-5', 'text-green-600')} />
                      <div>
                        <p className={cn('text-xs', 'text-gray-500')}>Refund Amount</p>
                        <p className={cn('font-medium', 'text-green-600')}>₹{refund.refund_amount}</p>
                      </div>
                    </div>

                    <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-blue-50', 'rounded-lg')}>
                      <ClockIcon className={cn('w-5', 'h-5', 'text-blue-600')} />
                      <div>
                        <p className={cn('text-xs', 'text-gray-500')}>Hours Before Departure</p>
                        <p className={cn('font-medium', 'text-blue-600')}>{refund.hours_before_departure || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Refund Reason */}
                  {refund.refund_reason && (
                    <div className={cn('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-4', 'mb-4')}>
                      <div className={cn('flex', 'items-start', 'gap-3')}>
                        <DocumentTextIcon className={cn('w-5', 'h-5', 'text-blue-600', 'flex-shrink-0', 'mt-0.5')} />
                        <div>
                          <p className={cn('text-blue-800', 'font-medium')}>Refund Reason</p>
                          <p className={cn('text-blue-700', 'text-sm', 'mt-1')}>{refund.refund_reason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {refund.admin_notes && (
                    <div className={cn('bg-yellow-50', 'border', 'border-yellow-200', 'rounded-lg', 'p-4', 'mb-4')}>
                      <div className={cn('flex', 'items-start', 'gap-3')}>
                        <ExclamationTriangleIcon className={cn('w-5', 'h-5', 'text-yellow-600', 'flex-shrink-0', 'mt-0.5')} />
                        <div>
                          <p className={cn('text-yellow-800', 'font-medium')}>Admin Notes</p>
                          <p className={cn('text-yellow-700', 'text-sm', 'mt-1')}>{refund.admin_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Razorpay Refund Status */}
                  {refund.razorpay_refund_id && (
                    <div className={cn('bg-purple-50', 'border', 'border-purple-200', 'rounded-lg', 'p-4', 'mb-4')}>
                      <div className={cn('flex', 'items-start', 'gap-3')}>
                        <CurrencyRupeeIcon className={cn('w-5', 'h-5', 'text-purple-600', 'flex-shrink-0', 'mt-0.5')} />
                        <div className="flex-1">
                          <p className={cn('text-purple-800', 'font-medium', 'mb-2')}>Instant Refund Details</p>
                          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-3', 'text-sm')}>
                            <div>
                              <span className="text-purple-600">Refund ID:</span>
                              <span className={cn('ml-2', 'font-mono', 'text-purple-900')}>{refund.razorpay_refund_id}</span>
                            </div>
                            {refund.razorpay_refund_status && (
                              <div>
                                <span className="text-purple-600">Status:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  refund.razorpay_refund_status === 'processed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : refund.razorpay_refund_status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {refund.razorpay_refund_status.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          {refund.razorpay_refund_status === 'processed' && (
                            <p className={cn('text-green-700', 'text-xs', 'mt-2')}>
                              ✅ Your refund has been processed instantly and will reflect in your account within 5-7 business days.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Information */}
                  <div className={cn('bg-gray-50', 'rounded-lg', 'p-4', 'mb-4')}>
                    <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4', 'text-sm')}>
                      <div>
                        <span className="text-gray-500">Requested:</span>
                        <span className={cn('ml-2', 'font-medium')}>
                          {new Date(refund.requested_at).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {refund.processed_at && (
                        <div>
                          <span className="text-gray-500">Processed:</span>
                          <span className={cn('ml-2', 'font-medium')}>
                            {new Date(refund.processed_at).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Processing Timeline */}
                  {refund.refund_status === 'PENDING' && refund.refund_amount > 0 && (
                    <div className={cn('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-4')}>
                      <p className={cn('text-blue-800', 'text-sm')}>
                        <strong>Processing Time:</strong> Your refund is being processed and will be credited 
                        to your original payment method within 7-10 business days.
                      </p>
                    </div>
                  )}

                  {refund.refund_status === 'APPROVED' && (
                    <div className={cn('bg-green-50', 'border', 'border-green-200', 'rounded-lg', 'p-4')}>
                      <p className={cn('text-green-800', 'text-sm')}>
                        <strong>Refund Approved:</strong> Your refund has been approved and will be processed shortly.
                      </p>
                    </div>
                  )}

                  {refund.refund_status === 'PROCESSED' && (
                    <div className={cn('bg-green-50', 'border', 'border-green-200', 'rounded-lg', 'p-4')}>
                      <p className={cn('text-green-800', 'text-sm')}>
                        <strong>Refund Processed:</strong> Your refund has been processed and credited to your account.
                      </p>
                    </div>
                  )}

                  {refund.refund_status === 'NOT_APPLICABLE' && (
                    <div className={cn('bg-gray-50', 'border', 'border-gray-200', 'rounded-lg', 'p-4')}>
                      <p className={cn('text-gray-800', 'text-sm')}>
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
        <div className={cn('mt-8', 'text-center')}>
          <button 
            onClick={() => router.push('/refund')}
            className={cn('text-blue-600', 'hover:text-blue-800', 'font-medium', 'text-sm')}
          >
            View Refund Policy →
          </button>
        </div>
      </div>
    </div>
  );
}