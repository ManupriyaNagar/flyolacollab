"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "@/baseUrl/baseUrl";
import {
  CalendarDaysIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [joyrideBookings, setJoyrideBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the user is not logged in (not during loading)
    if (!authState.isLoading && !authState.isLoggedIn) {
      router.push("/sign-in");
    }
  }, [authState.isLoading, authState.isLoggedIn, router]);

  // Show loading screen while auth is being verified
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn) {
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("token") || "";
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const commonOpts = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        };

        // Get user ID from auth state
        const userId = authState.user?.id;
        
        if (!userId) {
          throw new Error("User ID not found. Please log in again.");
        }
        
        // Fetch user bookings using the correct endpoint
        const fetchUserBookings = async () => {
          try {
            // Use the correct user bookings endpoint
            const userBookingsRes = await fetch(`${BASE_URL}/bookings/my`, commonOpts);
            if (userBookingsRes.ok) {
              return await userBookingsRes.json();
            }
          } catch (err) {
          }
          
          return [];
        };

        const fetchUserPayments = async () => {
          try {
            // Use the correct user payments endpoint
            const userPaymentsRes = await fetch(`${BASE_URL}/payments/user`, commonOpts);
            if (userPaymentsRes.ok) {
              return await userPaymentsRes.json();
            }
          } catch (err) {
          }
          
          return [];
        };

        // Fetch user data
        const [bookingsData, paymentsData] = await Promise.all([
          fetchUserBookings(),
          fetchUserPayments(),
        ]);

        // Fetch user's joyride bookings
        const fetchUserJoyrideBookings = async () => {
          try {
            // Try joyride bookings endpoint
            const userJoyrideRes = await fetch(`${BASE_URL}/api/joyride-slots/joyride-bookings`, commonOpts);
            if (userJoyrideRes.ok) {
              const allJoyrides = await userJoyrideRes.json();
              // Filter by user if the endpoint returns all bookings
              return Array.isArray(allJoyrides) ? allJoyrides.filter(booking => 
                String(booking.userId) === String(userId) || 
                String(booking.user_id) === String(userId)
              ) : [];
            }
          } catch (err) {
          }
          
          return [];
        };

        const joyrideData = await fetchUserJoyrideBookings();

        // Set the filtered user data
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        setJoyrideBookings(Array.isArray(joyrideData) ? joyrideData : []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        if (err.message.includes("Authentication failed")) {
          router.push("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authState, router]);

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const totalJoyrideBookings = joyrideBookings.length;
    const totalAllBookings = totalBookings + totalJoyrideBookings;
    
    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
    const pendingBookings = bookings.filter(b => b.bookingStatus === 'PENDING').length;
    const cancelledBookings = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;
    
    const totalSpent = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const joyrideSpent = joyrideBookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);
    const combinedSpent = totalSpent + joyrideSpent;
    
    const today = new Date();
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentBookings = bookings.filter(b => new Date(b.created_at || b.updated_at) >= last30Days);
    const recentJoyrideBookings = joyrideBookings.filter(b => new Date(b.created_at) >= last30Days);
    
    const upcomingBookings = bookings.filter(b => {
      const bookingDate = new Date(b.departure_date || b.created_at);
      return bookingDate > today && b.bookingStatus === 'CONFIRMED';
    }).length;

    return {
      totalBookings,
      totalJoyrideBookings,
      totalAllBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalSpent,
      joyrideSpent,
      combinedSpent,
      recentBookings: recentBookings.length,
      recentJoyrideBookings: recentJoyrideBookings.length,
      upcomingBookings,
    };
  }, [bookings, payments, joyrideBookings]);

  const bookingStatusData = useMemo(() => {
    return {
      labels: ['Confirmed', 'Pending', 'Cancelled'],
      datasets: [
        {
          data: [stats.confirmedBookings, stats.pendingBookings, stats.cancelledBookings],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [stats.confirmedBookings, stats.pendingBookings, stats.cancelledBookings]);

  const spendingTrend = useMemo(() => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push(date);
    }

    const monthlySpending = last6Months.map(date => {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const flightSpending = payments
        .filter(p => {
          const paymentDate = new Date(p.created_at || p.updated_at);
          return paymentDate >= monthStart && paymentDate <= monthEnd;
        })
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

      const joyrideSpending = joyrideBookings
        .filter(b => {
          const bookingDate = new Date(b.created_at);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        })
        .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

      return flightSpending + joyrideSpending;
    });

    return {
      labels: last6Months.map(date => date.toLocaleDateString('en-US', { month: 'short' })),
      datasets: [
        {
          label: "Monthly Spending (₹)",
          data: monthlySpending,
          borderColor: "rgba(168, 85, 247, 1)",
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(168, 85, 247, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    };
  }, [payments, joyrideBookings]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { font: { size: 12, weight: "600" } },
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 12, weight: "600" } },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.1)" },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const quickActions = [
    {
      title: "Book Flight",
      description: "Book your next flight",
      icon: <PaperAirplaneIcon className="w-6 h-6 text-blue-600" />,
      link: "/scheduled-flight",
      color: "bg-blue-100",
    },
    {
      title: "My Bookings",
      description: "View and manage bookings",
      icon: <TicketIcon className="w-6 h-6 text-green-600" />,
      link: "/user-dashboard/bookings",
      color: "bg-green-100",
    },
    {
      title: "My Refunds",
      description: "Track refund status",
      icon: <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />,
      link: "/user-dashboard/refunds",
      color: "bg-emerald-100",
    },
    {
      title: "Support",
      description: "Get help and support",
      icon: <BellIcon className="w-6 h-6 text-orange-600" />,
      link: "/user-dashboard/support",
      color: "bg-orange-100",
    },
  ];

  const recentBookingsList = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at))
      .slice(0, 5);
  }, [bookings]);

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            My Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Welcome to your personal travel dashboard - Track your journeys and manage bookings</p>
        </div>
        
        <div className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Bookings</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? "--" : stats.totalAllBookings}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <TicketIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">{stats.totalBookings} Flights</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-slate-600">{stats.totalJoyrideBookings} Joyrides</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Spent</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? "--" : `₹${stats.combinedSpent.toLocaleString('en-IN')}`}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/user-dashboard/payments" 
              className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
            >
              View payments
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Confirmed Bookings</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? "--" : stats.confirmedBookings}
              </h3>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/user-dashboard/bookings" 
              className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
            >
              View bookings
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Upcoming Trips</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? "--" : stats.upcomingBookings}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <div>Pending: {stats.pendingBookings}</div>
          </div>
        </div>
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Spending Trend</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <Line data={spendingTrend} options={lineChartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Booking Status</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <Doughnut data={bookingStatusData} options={doughnutOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-3">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                href={action.link}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-sm">{action.title}</h4>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Recent Bookings</h3>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentBookingsList.length > 0 ? (
            <div className="space-y-3">
              {recentBookingsList.map((booking, index) => (
                <div key={booking.id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <PaperAirplaneIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">#{booking.bookingNo || booking.id}</p>
                      <p className="text-sm text-slate-500">
                        PNR: {booking.pnr || 'N/A'} • {new Date(booking.created_at || booking.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.bookingStatus === 'CONFIRMED' 
                      ? 'bg-green-100 text-green-800'
                      : booking.bookingStatus === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.bookingStatus || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <TicketIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-lg font-medium mb-2">No bookings yet</p>
              <p className="text-sm">Start your journey by booking your first flight!</p>
              <Link 
                href="/scheduled-flight"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                Book Now
              </Link>
            </div>
          )}
          {recentBookingsList.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <Link 
                href="/user-dashboard/bookings" 
                className="text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center justify-center gap-1"
              >
                View all bookings
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-blue-200 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ChartBarIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800 mb-2">Account Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Recent Activity:</span>
                <span className="ml-2 text-blue-600">{stats.recentBookings + stats.recentJoyrideBookings} bookings (30 days)</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Success Rate:</span>
                <span className="ml-2 text-blue-600">
                  {stats.totalBookings > 0 ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) : 0}%
                </span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Flight Spending:</span>
                <span className="ml-2 text-blue-600">₹{stats.totalSpent.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Joyride Spending:</span>
                <span className="ml-2 text-blue-600">₹{stats.joyrideSpent.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
