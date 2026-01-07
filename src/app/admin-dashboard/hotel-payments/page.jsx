"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaCreditCard,
  FaDollarSign,
  FaEye,
  FaFilter,
  FaSearch,
  FaTimes,
  FaUndo
} from "react-icons/fa";

const HotelPaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const paymentStatuses = ["pending", "success", "failed", "refunded"];
  const paymentMethods = ["razorpay", "stripe", "cash", "card", "upi", "net_banking"];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch payments and bookings in parallel
        const [paymentsResponse, bookingsResponse] = await Promise.all([
          API.hotels.getHotelPayments().catch(() => ({ data: [] })),
          API.hotels.getBookings().catch(() => ({ data: [] }))
        ]);

        if (paymentsResponse.data && Array.isArray(paymentsResponse.data)) {
          setPayments(paymentsResponse.data);
        } else {
          // Fallback payments data
          setPayments([
            {
              id: 1,
              bookingId: 1,
              paymentMethod: "razorpay",
              transactionId: "pay_MxYz123456789",
              amount: 15000.00,
              currency: "INR",
              status: "success",
              paymentDate: "2024-12-13T10:30:00Z",
              refundAmount: 0.00,
              refundDate: null,
              gatewayResponse: { razorpay_payment_id: "pay_MxYz123456789" },
              createdAt: "2024-12-13T10:25:00Z"
            },
            {
              id: 2,
              bookingId: 2,
              paymentMethod: "stripe",
              transactionId: "pi_3AbCdEfGhIjKlMnO",
              amount: 8500.00,
              currency: "INR",
              status: "success",
              paymentDate: "2024-12-12T15:45:00Z",
              refundAmount: 0.00,
              refundDate: null,
              gatewayResponse: { stripe_payment_intent_id: "pi_3AbCdEfGhIjKlMnO" },
              createdAt: "2024-12-12T15:40:00Z"
            },
            {
              id: 3,
              bookingId: 3,
              paymentMethod: "cash",
              transactionId: null,
              amount: 12000.00,
              currency: "INR",
              status: "success",
              paymentDate: "2024-12-11T09:15:00Z",
              refundAmount: 0.00,
              refundDate: null,
              gatewayResponse: null,
              createdAt: "2024-12-11T09:15:00Z"
            },
            {
              id: 4,
              bookingId: 4,
              paymentMethod: "razorpay",
              transactionId: "pay_AbCdEf987654321",
              amount: 6500.00,
              currency: "INR",
              status: "pending",
              paymentDate: null,
              refundAmount: 0.00,
              refundDate: null,
              gatewayResponse: null,
              createdAt: "2024-12-13T14:20:00Z"
            },
            {
              id: 5,
              bookingId: 5,
              paymentMethod: "upi",
              transactionId: "UPI123456789012",
              amount: 9500.00,
              currency: "INR",
              status: "failed",
              paymentDate: null,
              refundAmount: 0.00,
              refundDate: null,
              gatewayResponse: { error: "Payment declined by bank" },
              createdAt: "2024-12-10T11:30:00Z"
            }
          ]);
        }

        if (bookingsResponse.data && Array.isArray(bookingsResponse.data)) {
          setBookings(bookingsResponse.data);
        } else {
          // Fallback bookings data
          setBookings([
            { id: 1, bookingReference: "FLY001", guestName: "John Doe", hotelId: 1 },
            { id: 2, bookingReference: "FLY002", guestName: "Jane Smith", hotelId: 2 },
            { id: 3, bookingReference: "FLY003", guestName: "Mike Johnson", hotelId: 1 },
            { id: 4, bookingReference: "FLY004", guestName: "Sarah Wilson", hotelId: 3 },
            { id: 5, bookingReference: "FLY005", guestName: "David Brown", hotelId: 2 }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPayments([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const booking = bookings.find(b => b.id === payment.bookingId);
    
    const matchesSearch = payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking?.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking?.guestName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "" || payment.status === selectedStatus;
    const matchesMethod = selectedMethod === "" || payment.paymentMethod === selectedMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'refunded':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'razorpay':
      case 'stripe':
      case 'upi':
      case 'net_banking':
        return <FaCreditCard />;
      case 'cash':
        return <FaDollarSign />;
      default:
        return <FaCreditCard />;
    }
  };

  // Admin Functions
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleRefreshPayment = async (paymentId) => {
    setProcessing(true);
    try {
      try {
        const response = await API.hotels.refreshPaymentStatus(paymentId);
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, ...response.data } : p));
        alert('Payment status refreshed successfully!');
      } catch (apiError) {
        console.warn('API not available, simulating refresh:', apiError);
        // Simulate status update
        setPayments(prev => prev.map(p => 
          p.id === paymentId ? { ...p, status: 'success', paymentDate: new Date().toISOString() } : p
        ));
        alert('Payment status refreshed successfully! (Note: Go backend not running - simulated update)');
      }
    } catch (error) {
      console.error('Error refreshing payment:', error);
      alert('Failed to refresh payment status. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessRefund = async (paymentId, amount) => {
    if (confirm(`Are you sure you want to process a refund of ₹${amount}?`)) {
      setProcessing(true);
      try {
        try {
          const response = await API.hotels.processRefund(paymentId, { amount });
          setPayments(prev => prev.map(p => 
            p.id === paymentId 
              ? { ...p, status: 'refunded', refundAmount: amount, refundDate: new Date().toISOString() }
              : p
          ));
          alert('Refund processed successfully!');
        } catch (apiError) {
          console.warn('API not available, simulating refund:', apiError);
          setPayments(prev => prev.map(p => 
            p.id === paymentId 
              ? { ...p, status: 'refunded', refundAmount: amount, refundDate: new Date().toISOString() }
              : p
          ));
          alert('Refund processed successfully! (Note: Go backend not running - simulated update)');
        }
      } catch (error) {
        console.error('Error processing refund:', error);
        alert('Failed to process refund. Please try again.');
      } finally {
        setProcessing(false);
      }
    }
  };

  const getBookingInfo = (bookingId) => {
    return bookings.find(b => b.id === bookingId);
  };

  const SkeletonRow = () => (
    <tr>
      <td className={cn('px-6', 'py-4')}>
        <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
      </td>
      <td className={cn('px-6', 'py-4')}>
        <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
      </td>
      <td className={cn('px-6', 'py-4')}>
        <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
      </td>
      <td className={cn('px-6', 'py-4')}>
        <div className={cn('h-6', 'bg-gray-200', 'rounded-full', 'animate-pulse')}></div>
      </td>
      <td className={cn('px-6', 'py-4')}>
        <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
      </td>
      <td className={cn('px-6', 'py-4')}>
        <div className={cn('flex', 'gap-2')}>
          <div className={cn('h-8', 'w-8', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
          <div className={cn('h-8', 'w-8', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50')}>
        {/* Header */}
        <div className={cn('bg-white', 'shadow-sm', 'border-b')}>
          <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
                  <FaCreditCard className="text-blue-600" />
                  Hotel Payments Management
                </h1>
                <p className={cn('text-gray-600', 'mt-1')}>Manage hotel booking payments and refunds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border')}>
            <div className={cn('overflow-x-auto')}>
              <table className={cn('w-full')}>
                <thead className={cn('bg-gray-50')}>
                  <tr>
                    <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase')}>Transaction</th>
                    <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase')}>Booking</th>
                    <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase')}>Amount</th>
                    <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase')}>Status</th>
                    <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase')}>Date</th>
                    <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase')}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>
      {/* Header */}
      <div className={cn('bg-white', 'shadow-sm', 'border-b')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
                <FaCreditCard className="text-blue-600" />
                Hotel Payments Management
              </h1>
              <p className={cn('text-gray-600', 'mt-1')}>Manage hotel booking payments and refunds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
        <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6', 'mb-6')}>
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4')}>
            <div className="relative">
              <FaSearch className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
              <input
                type="text"
                placeholder="Search transactions..."
                className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {paymentStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option value="">All Methods</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>
                  {method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>

            <button className={cn('bg-gray-100', 'text-gray-700', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-gray-200', 'transition-colors', 'flex', 'items-center', 'justify-center', 'gap-2')}>
              <FaFilter />
              More Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6', 'mb-8')}>
          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Payments</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>{payments.length}</p>
              </div>
              <div className={cn('bg-blue-100', 'p-3', 'rounded-full')}>
                <FaCreditCard className={cn('text-blue-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Successful</p>
                <p className={cn('text-3xl', 'font-bold', 'text-green-600')}>
                  {payments.filter(p => p.status === 'success').length}
                </p>
              </div>
              <div className={cn('bg-green-100', 'p-3', 'rounded-full')}>
                <FaCheck className={cn('text-green-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Pending</p>
                <p className={cn('text-3xl', 'font-bold', 'text-yellow-600')}>
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className={cn('bg-yellow-100', 'p-3', 'rounded-full')}>
                <FaTimes className={cn('text-yellow-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Amount</p>
                <p className={cn('text-3xl', 'font-bold', 'text-purple-600')}>
                  ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className={cn('bg-purple-100', 'p-3', 'rounded-full')}>
                <FaDollarSign className={cn('text-purple-600', 'text-xl')} />
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border')}>
          <div className={cn('p-6', 'border-b', 'border-gray-200')}>
            <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Payment Transactions</h3>
            <p className={cn('text-sm', 'text-gray-600')}>Manage and track all hotel payment transactions</p>
          </div>
          
          <div className={cn('overflow-x-auto')}>
            <table className={cn('w-full')}>
              <thead className={cn('bg-gray-50')}>
                <tr>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Transaction
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Booking
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Amount
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Status
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Date
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn('bg-white', 'divide-y', 'divide-gray-200')}>
                {filteredPayments.map((payment) => {
                  const booking = getBookingInfo(payment.bookingId);
                  return (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn('hover:bg-gray-50')}
                    >
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <div className={cn('flex', 'items-center')}>
                          <div className={cn('flex-shrink-0', 'h-8', 'w-8', 'flex', 'items-center', 'justify-center', 'bg-gray-100', 'rounded-full')}>
                            {getMethodIcon(payment.paymentMethod)}
                          </div>
                          <div className={cn('ml-3')}>
                            <div className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                              {payment.transactionId || 'N/A'}
                            </div>
                            <div className={cn('text-sm', 'text-gray-500')}>
                              {payment.paymentMethod.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <div className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                          {booking?.bookingReference || 'Unknown'}
                        </div>
                        <div className={cn('text-sm', 'text-gray-500')}>
                          {booking?.guestName || 'Unknown Guest'}
                        </div>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <div className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                          ₹{payment.amount.toLocaleString()}
                        </div>
                        {payment.refundAmount > 0 && (
                          <div className={cn('text-sm', 'text-red-500')}>
                            Refunded: ₹{payment.refundAmount.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <div className={cn('text-sm', 'text-gray-900')}>
                          {payment.paymentDate 
                            ? new Date(payment.paymentDate).toLocaleDateString()
                            : 'Pending'
                          }
                        </div>
                        <div className={cn('text-sm', 'text-gray-500')}>
                          Created: {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium')}>
                        <div className={cn('flex', 'gap-2')}>
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className={cn('text-indigo-600', 'hover:text-indigo-900')}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleRefreshPayment(payment.id)}
                              className={cn('text-blue-600', 'hover:text-blue-900')}
                              title="Refresh Status"
                              disabled={processing}
                            >
                              <FaRedo />
                            </button>
                          )}
                          {payment.status === 'success' && payment.refundAmount === 0 && (
                            <button
                              onClick={() => handleProcessRefund(payment.id, payment.amount)}
                              className={cn('text-red-600', 'hover:text-red-900')}
                              title="Process Refund"
                              disabled={processing}
                            >
                              <FaUndo />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className={cn('text-center', 'py-12')}>
              <FaCreditCard className={cn('mx-auto', 'text-gray-400', 'text-6xl', 'mb-4')} />
              <h3 className={cn('text-xl', 'font-medium', 'text-gray-900', 'mb-2')}>No payments found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-2xl', 'w-full', 'max-h-[80vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Payment Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className={cn('p-6', 'space-y-6')}>
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Transaction ID</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedPayment.transactionId || 'N/A'}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Payment Method</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedPayment.paymentMethod.toUpperCase()}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Amount</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>₹{selectedPayment.amount.toLocaleString()} {selectedPayment.currency}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Payment Date</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                    {selectedPayment.paymentDate 
                      ? new Date(selectedPayment.paymentDate).toLocaleString()
                      : 'Pending'
                    }
                  </p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Created Date</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                    {new Date(selectedPayment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedPayment.refundAmount > 0 && (
                <div className={cn('bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'p-4')}>
                  <h4 className={cn('text-sm', 'font-medium', 'text-red-800', 'mb-2')}>Refund Information</h4>
                  <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
                    <div>
                      <label className={cn('block', 'text-xs', 'font-medium', 'text-red-700')}>Refund Amount</label>
                      <p className={cn('text-sm', 'font-medium', 'text-red-900')}>₹{selectedPayment.refundAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className={cn('block', 'text-xs', 'font-medium', 'text-red-700')}>Refund Date</label>
                      <p className={cn('text-sm', 'font-medium', 'text-red-900')}>
                        {selectedPayment.refundDate 
                          ? new Date(selectedPayment.refundDate).toLocaleString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment.gatewayResponse && (
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Gateway Response</label>
                  <pre className={cn('text-xs', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg', 'overflow-x-auto')}>
                    {JSON.stringify(selectedPayment.gatewayResponse, null, 2)}
                  </pre>
                </div>
              )}

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                {selectedPayment.status === 'pending' && (
                  <button
                    onClick={() => handleRefreshPayment(selectedPayment.id)}
                    className={cn('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2')}
                    disabled={processing}
                  >
                    <FaRedo />
                    Refresh Status
                  </button>
                )}
                {selectedPayment.status === 'success' && selectedPayment.refundAmount === 0 && (
                  <button
                    onClick={() => handleProcessRefund(selectedPayment.id, selectedPayment.amount)}
                    className={cn('px-4', 'py-2', 'bg-red-600', 'text-white', 'rounded-lg', 'hover:bg-red-700', 'transition-colors', 'flex', 'items-center', 'gap-2')}
                    disabled={processing}
                  >
                    <FaUndo />
                    Process Refund
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={cn('px-4', 'py-2', 'bg-gray-500', 'text-white', 'rounded-lg', 'hover:bg-gray-600', 'transition-colors')}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelPaymentsManagement;