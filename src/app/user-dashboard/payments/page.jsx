"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import BASE_URL from "@/baseUrl/baseUrl";
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  CalendarDaysIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserPaymentsPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authState.isLoading && !authState.isLoggedIn) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn) return;
    fetchUserPayments();
  }, [authState]);

  const fetchUserPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please sign in again.");

      // Fetch user-specific payments
      const res = await fetch(`${BASE_URL}/payments/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: Failed to fetch payments`);
      }

      // If data is an array, use it directly; if it's an object with data property, use that
      const paymentsData = Array.isArray(data) ? data : (data.data || []);
      setPayments(paymentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'refunded':
      case 'refund_pending':
        return <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
      case 'refund_pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethod = (payment) => {
    return payment.payment_method || payment.pay_mode || payment.method || 'Online';
  };

  const getPaymentAmount = (payment) => {
    // Try different field names and parse as number
    const amount = payment.payment_amount || payment.amount || payment.pay_amt || payment.total_amount || '0';
    return parseFloat(amount) || 0;
  };

  if (authState.isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Payments</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchUserPayments}
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          </div>
          <p className="text-gray-600">Track all your payment transactions and receipts</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Payments</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{payments.length}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{payments.reduce((sum, p) => sum + parseFloat(getPaymentAmount(p) || 0), 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Successful</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.filter(p => ['success', 'completed', 'paid'].includes(p.payment_status?.toLowerCase() || p.status?.toLowerCase())).length}
                </h3>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.filter(p => p.payment_status?.toLowerCase() === 'pending' || p.status?.toLowerCase() === 'pending').length}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <CreditCardIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any payments yet.</p>
            <button 
              onClick={() => router.push('/user-dashboard/bookings')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Bookings
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment, index) => (
              <div key={payment.id || index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Payment Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <CreditCardIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Payment #{payment.id || payment.transaction_id || index + 1}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {payment.booking_id ? `Booking ID: ${payment.booking_id}` : 'General Payment'}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(payment.payment_status || payment.status)}`}>
                      {getStatusIcon(payment.payment_status || payment.status)}
                      <span className="text-sm font-medium">{payment.payment_status || payment.status || 'Unknown'}</span>
                    </div>
                  </div>

                  {/* Payment Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CurrencyRupeeIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-medium text-gray-900">₹{parseFloat(getPaymentAmount(payment) || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCardIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Method</p>
                        <p className="font-medium text-gray-900">{getPaymentMethod(payment)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CalendarDaysIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {payment.created_at ? new Date(payment.created_at).toLocaleDateString('en-IN') : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Transaction ID</p>
                        <p className="font-medium text-gray-900 text-xs">
                          {payment.transaction_id || payment.razorpay_payment_id || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {(payment.description || payment.notes) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-800 font-medium">Payment Details</p>
                          <p className="text-blue-700 text-sm mt-1">{payment.description || payment.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Refund Information */}
                  {payment.refund_amount && parseFloat(payment.refund_amount) > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <CurrencyRupeeIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-800 font-medium">Refund Information</p>
                          <p className="text-green-700 text-sm mt-1">
                            Refund Amount: ₹{parseFloat(payment.refund_amount).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Timeline */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 font-medium">
                          {payment.created_at ? new Date(payment.created_at).toLocaleString('en-IN') : 'N/A'}
                        </span>
                      </div>
                      {payment.updated_at && (
                        <div>
                          <span className="text-gray-500">Updated:</span>
                          <span className="ml-2 font-medium">
                            {new Date(payment.updated_at).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}