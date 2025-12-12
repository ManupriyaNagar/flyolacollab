"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  TicketIcon,
  UserIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function AdminDashboard() {
  const [flights, setFlights] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [airports, setAirports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [joyrideBookings, setJoyrideBookings] = useState([]);
  const [joyrideSlots, setJoyrideSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth state is fully loaded and confirmed not logged in
    if (!authState.isLoading && authState.isLoggedIn === false) {
      router.push("/sign-in");
    } else if (!authState.isLoading && authState.isLoggedIn && authState.userRole !== "1") {
      // Logged in but not admin - redirect to appropriate dashboard
      router.push("/");
    }
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole, router]);

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn || authState.userRole !== "1") {
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token") || "";
        if (!token) {
          // No token found - redirect immediately
          localStorage.clear();
          router.push("/sign-in");
          return;
        }

        const commonOpts = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        };

        // Single API call to fetch all dashboard data
        const response = await fetch(`${BASE_URL}/api/admin/dashboard-stats`, commonOpts);
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect immediately on 401, don't retry
            localStorage.removeItem("token");
            router.push("/sign-in");
            return;
          }
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }

        const result = await response.json();
        
        if (!isMounted) return; // Prevent state updates if component unmounted
        
        if (result.success && result.data) {
          const {
            flights: flightsData,
            schedules: schedulesData,
            airports: airportsData,
            bookings: bookingsData,
            passengers: passengersData,
            users: usersData,
            reviews: reviewsData,
            payments: paymentsData,
            joyrideBookings: joyrideBookingsData,
            joyrideSlots: joyrideSlotsData
          } = result.data;

          // Set all state at once
          setFlights(Array.isArray(flightsData) ? flightsData : []);
          setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
          setAirports(Array.isArray(airportsData) ? airportsData : []);
          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
          setPassengers(Array.isArray(passengersData) ? passengersData : []);
          setUsers(Array.isArray(usersData) ? usersData : []);
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
          setPayments(Array.isArray(paymentsData) ? paymentsData : []);
          setJoyrideBookings(Array.isArray(joyrideBookingsData) ? joyrideBookingsData : []);
          setJoyrideSlots(Array.isArray(joyrideSlotsData) ? joyrideSlotsData : []);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        if (!isMounted) return; // Prevent state updates if component unmounted
        
        console.error('Dashboard data fetch error:', err);
        setError(err.message);
        toast.error(err.message, { toastId: 'dashboard-error' }); // Prevent duplicate toasts
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole, router]);

  const stats = useMemo(() => {
    const totalFlights = flights.length;
    const totalSchedules = schedules.length;
    const totalAirports = airports.length;
    const activeSchedules = schedules.filter((s) => s.status === 1).length;
    const totalBookings = bookings.length;
    const totalPassengers = passengers.length;
    const totalUsers = users.length;
    const totalReviews = reviews.length;
    const totalJoyrideBookings = joyrideBookings.length;
    const totalJoyrideSlots = joyrideSlots.length;

    const averageRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : "0.0";

    // Calculate revenue with comprehensive field checking and debugging
    let totalRevenue = 0;
    let joyrideRevenue = 0;

    // Calculate payment revenue
    if (payments.length > 0) {
      totalRevenue = payments.reduce((sum, p) => {
        // Try all possible field names for payment amount
        const possibleAmounts = [
          p.amount,
          p.total_amount,
          p.price,
          p.total_price,
          p.payment_amount,
          p.totalAmount,
          p.paymentAmount,
          p.cost,
          p.fare,
          p.booking_amount,
          p.bookingAmount
        ];

        let amount = 0;
        for (const possibleAmount of possibleAmounts) {
          const parsed = parseFloat(possibleAmount);
          if (!isNaN(parsed) && parsed > 0) {
            amount = parsed;
            break;
          }
        }

        if (amount > 0) {
        }

        return sum + amount;
      }, 0);
    }

    // Calculate joyride revenue
    if (joyrideBookings.length > 0) {
      joyrideRevenue = joyrideBookings.reduce((sum, b) => {
        // Try all possible field names for joyride amount
        const possibleAmounts = [
          b.total_price,
          b.amount,
          b.price,
          b.booking_amount,
          b.bookingAmount,
          b.totalPrice,
          b.cost,
          b.fare,
          b.payment_amount,
          b.paymentAmount
        ];

        let amount = 0;
        for (const possibleAmount of possibleAmounts) {
          const parsed = parseFloat(possibleAmount);
          if (!isNaN(parsed) && parsed > 0) {
            amount = parsed;
            break;
          }
        }

        if (amount > 0) {
        }

        return sum + amount;
      }, 0);
    }

    // Also try to get revenue from bookings if payments are empty
    let bookingRevenue = 0;
    if (totalRevenue === 0 && bookings.length > 0) {
      bookingRevenue = bookings.reduce((sum, b) => {
        const possibleAmounts = [
          b.amount,
          b.total_amount,
          b.price,
          b.total_price,
          b.fare,
          b.cost,
          b.booking_amount,
          b.bookingAmount,
          b.totalAmount,
          b.payment_amount
        ];

        let amount = 0;
        for (const possibleAmount of possibleAmounts) {
          const parsed = parseFloat(possibleAmount);
          if (!isNaN(parsed) && parsed > 0) {
            amount = parsed;
            break;
          }
        }

        return sum + amount;
      }, 0);
    }

    const combinedRevenue = totalRevenue + joyrideRevenue + bookingRevenue;

    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentBookings = bookings.filter(b => new Date(b.created_at || b.updated_at) >= last7Days);
    const recentJoyrideBookings = joyrideBookings.filter(b => new Date(b.created_at) >= last7Days);

    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
    const pendingBookings = bookings.filter(b => b.bookingStatus === 'PENDING').length;
    const cancelledBookings = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;

    return {
      totalFlights,
      totalSchedules,
      totalAirports,
      activeSchedules,
      totalBookings,
      totalPassengers,
      totalUsers,
      totalReviews,
      totalJoyrideBookings,
      totalJoyrideSlots,
      averageRating,
      totalRevenue,
      joyrideRevenue,
      bookingRevenue,
      combinedRevenue,
      recentBookings: recentBookings.length,
      recentJoyrideBookings: recentJoyrideBookings.length,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
    };
  }, [flights, schedules, airports, bookings, passengers, users, reviews, payments, joyrideBookings, joyrideSlots]);

  const bookingsByDay = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const flightCounts = days.map((_, index) =>
      bookings.filter((b) => {
        const bookingDate = new Date(b.created_at || b.updated_at);
        return bookingDate.getDay() === ((index + 1) % 7);
      }).length
    );
    const joyrideCounts = days.map((_, index) =>
      joyrideBookings.filter((b) => {
        const bookingDate = new Date(b.created_at);
        return bookingDate.getDay() === ((index + 1) % 7);
      }).length
    );

    return {
      labels: days,
      datasets: [
        {
          label: "Flight Bookings",
          data: flightCounts,
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: "Joyride Bookings",
          data: joyrideCounts,
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }, [bookings, joyrideBookings]);

  const revenueTrend = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date);
    }

    const dailyRevenue = last7Days.map(date => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const flightRevenue = payments
        .filter(p => {
          const paymentDate = new Date(p.created_at || p.updated_at);
          return paymentDate >= dayStart && paymentDate <= dayEnd;
        })
        .reduce((sum, p) => {
          const amount = parseFloat(p.amount) || parseFloat(p.total_amount) || parseFloat(p.price) || parseFloat(p.total_price) || 0;
          return sum + amount;
        }, 0);

      const joyrideRevenue = joyrideBookings
        .filter(b => {
          const bookingDate = new Date(b.created_at);
          return bookingDate >= dayStart && bookingDate <= dayEnd;
        })
        .reduce((sum, b) => {
          const amount = parseFloat(b.total_price) || parseFloat(b.amount) || parseFloat(b.price) || 0;
          return sum + amount;
        }, 0);

      // Also check bookings for revenue if payments are empty
      const bookingRevenue = bookings
        .filter(b => {
          const bookingDate = new Date(b.created_at || b.updated_at);
          return bookingDate >= dayStart && bookingDate <= dayEnd;
        })
        .reduce((sum, b) => {
          const amount = parseFloat(b.amount) || parseFloat(b.total_amount) || parseFloat(b.price) || parseFloat(b.total_price) || parseFloat(b.fare) || 0;
          return sum + amount;
        }, 0);

      return flightRevenue + joyrideRevenue + bookingRevenue;
    });

    return {
      labels: last7Days.map(date => date.toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        {
          label: "Daily Revenue (₹)",
          data: dailyRevenue,
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

  const chartOptions = {
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
      },
      x: {
        grid: { display: false },
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
          callback: function (value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      },
      x: {
        grid: { display: false },
      },
    },
  };

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

  const quickActions = [
    {
      title: "Add Flight",
      description: "Create a new flight route",
      icon: <PaperAirplaneIcon className={cn('w-6', 'h-6', 'text-blue-600')} />,
      link: "/admin-dashboard/add-flight",
      color: "bg-blue-100",
    },
    {
      title: "Add Airport",
      description: "Add a new airport location",
      icon: <BuildingOfficeIcon className={cn('w-6', 'h-6', 'text-emerald-600')} />,
      link: "/admin-dashboard/add-airport",
      color: "bg-emerald-100",
    },
    {
      title: "Schedule Flight",
      description: "Create flight schedules",
      icon: <CalendarDaysIcon className={cn('w-6', 'h-6', 'text-purple-600')} />,
      link: "/admin-dashboard/scheduled-flight",
      color: "bg-purple-100",
    },
    {
      title: "Joy Ride Slots",
      description: "Manage joy ride availability",
      icon: <SparklesIcon className={cn('w-6', 'h-6', 'text-pink-600')} />,
      link: "/admin-dashboard/bookid-joyride",
      color: "bg-pink-100",
    },

    {
      title: "Schedule Management",
      description: "Upload flight schedule file",
      icon: <CalendarDaysIcon className={cn('w-6', 'h-6', 'text-indigo-600')} />,
      link: "/admin-dashboard/schedule-management",
      color: "bg-indigo-100",
    },
  ];

  const recentBookingsList = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at))
      .slice(0, 5);
  }, [bookings]);

  // Show loading while auth is being verified
  if (authState.isLoading) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('w-12', 'h-12', 'border-4', 'border-blue-500', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin (redirect will happen via useEffect)
  if (!authState.isLoggedIn || authState.userRole !== "1") {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('w-12', 'h-12', 'border-4', 'border-blue-500', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={cn('flex', 'flex-col', 'lg:flex-row', 'lg:items-center', 'lg:justify-between', 'gap-4')}>
        <div>
          <h1 className={cn('text-3xl', 'font-bold', 'text-slate-800', 'flex', 'items-center', 'gap-3')}>
            <div className={cn('p-2', 'bg-gradient-to-r', 'from-blue-500', 'to-indigo-500', 'rounded-xl')}>
              <ChartBarIcon className={cn('w-8', 'h-8', 'text-white')} />
            </div>
            Admin Dashboard
          </h1>
          <p className={cn('text-slate-600', 'mt-2')}>Welcome to the Flyola admin dashboard - Monitor your business at a glance</p>
        </div>

        <div className={cn('text-sm', 'text-slate-500')}>
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {error && (
        <div className={cn('flex', 'items-center', 'gap-3', 'p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-xl', 'text-red-700')}>
          <ExclamationTriangleIcon className={cn('w-5', 'h-5', 'flex-shrink-0')} />
          {error}
        </div>
      )}

      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')}>
        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6', 'transition-all', 'duration-200', 'hover:shadow-xl')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-slate-500')}>Total Revenue</p>
              <h3 className={cn('text-3xl', 'font-bold', 'text-slate-800', 'mt-1')}>
                {loading ? "--" : `₹${stats.combinedRevenue.toLocaleString('en-IN')}`}
              </h3>
              {!loading && stats.combinedRevenue === 0 && (
                <p className={cn('text-xs', 'text-amber-600', 'mt-1')}>
                  No revenue data available
                </p>
              )}
            </div>
          
          </div>
          <div className="mt-4">
            <div className={cn('text-xs', 'text-slate-600', 'mb-2')}>
              <div>Payments: ₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
              <div>Joyrides: ₹{stats.joyrideRevenue.toLocaleString('en-IN')}</div>
              {stats.bookingRevenue > 0 && (
                <div>Bookings: ₹{stats.bookingRevenue.toLocaleString('en-IN')}</div>
              )}
            </div>
            <Link
              href="/admin-dashboard/booking-data"
              className={cn('text-sm', 'text-green-600', 'hover:text-green-800', 'font-medium', 'flex', 'items-center', 'gap-1')}
            >
              View analytics
              <ArrowRightIcon className={cn('w-4', 'h-4')} />
            </Link>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6', 'transition-all', 'duration-200', 'hover:shadow-xl')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-slate-500')}>Total Bookings</p>
              <h3 className={cn('text-3xl', 'font-bold', 'text-slate-800', 'mt-1')}>
                {loading ? "--" : stats.totalBookings + stats.totalJoyrideBookings}
              </h3>
            </div>
            <div className={cn('p-3', 'bg-blue-100', 'rounded-xl')}>
              <TicketIcon className={cn('w-6', 'h-6', 'text-blue-600')} />
            </div>
          </div>
          <div className={cn('mt-4', 'flex', 'items-center', 'gap-4', 'text-sm')}>
            <div className={cn('flex', 'items-center', 'gap-1')}>
              <div className={cn('w-2', 'h-2', 'bg-blue-500', 'rounded-full')}></div>
              <span className="text-slate-600">{stats.totalBookings} Flights</span>
            </div>
            <div className={cn('flex', 'items-center', 'gap-1')}>
              <div className={cn('w-2', 'h-2', 'bg-green-500', 'rounded-full')}></div>
              <span className="text-slate-600">{stats.totalJoyrideBookings} Joyrides</span>
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6', 'transition-all', 'duration-200', 'hover:shadow-xl')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-slate-500')}>Total Users</p>
              <h3 className={cn('text-3xl', 'font-bold', 'text-slate-800', 'mt-1')}>
                {loading ? "--" : stats.totalUsers}
              </h3>
            </div>
            <div className={cn('p-3', 'bg-indigo-100', 'rounded-xl')}>
              <UsersIcon className={cn('w-6', 'h-6', 'text-indigo-600')} />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin-dashboard/all-users"
              className={cn('text-sm', 'text-indigo-600', 'hover:text-indigo-800', 'font-medium', 'flex', 'items-center', 'gap-1')}
            >
              Manage users
              <ArrowRightIcon className={cn('w-4', 'h-4')} />
            </Link>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6', 'transition-all', 'duration-200', 'hover:shadow-xl')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <p className={cn('text-sm', 'font-medium', 'text-slate-500')}>System Health</p>
              <h3 className={cn('text-3xl', 'font-bold', 'text-emerald-600', 'mt-1')}>
                {loading ? "--" : "Excellent"}
              </h3>
            </div>
            <div className={cn('p-3', 'bg-emerald-100', 'rounded-xl')}>
              <ArrowTrendingUpIcon className={cn('w-6', 'h-6', 'text-emerald-600')} />
            </div>
          </div>
          <div className={cn('mt-4', 'text-sm', 'text-slate-600')}>
            <div>Active Schedules: {stats.activeSchedules}</div>
            <div>Airports: {stats.totalAirports}</div>
          </div>
        </div>
      </div>

      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-5', 'gap-4')}>
        <div className={cn('bg-white', 'rounded-xl', 'shadow-md', 'border', 'border-slate-200', 'p-4')}>
          <div className={cn('flex', 'items-center', 'gap-3')}>
            <PaperAirplaneIcon className={cn('w-5', 'h-5', 'text-blue-500')} />
            <div>
              <p className={cn('text-xs', 'text-slate-500')}>Flights</p>
              <p className={cn('font-semibold', 'text-slate-800')}>{stats.totalFlights}</p>
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-xl', 'shadow-md', 'border', 'border-slate-200', 'p-4')}>
          <div className={cn('flex', 'items-center', 'gap-3')}>
            <CalendarDaysIcon className={cn('w-5', 'h-5', 'text-purple-500')} />
            <div>
              <p className={cn('text-xs', 'text-slate-500')}>Schedules</p>
              <p className={cn('font-semibold', 'text-slate-800')}>{stats.totalSchedules}</p>
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-xl', 'shadow-md', 'border', 'border-slate-200', 'p-4')}>
          <div className={cn('flex', 'items-center', 'gap-3')}>
            <UserIcon className={cn('w-5', 'h-5', 'text-green-500')} />
            <div>
              <p className={cn('text-xs', 'text-slate-500')}>Passengers</p>
              <p className={cn('font-semibold', 'text-slate-800')}>{stats.totalPassengers}</p>
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-xl', 'shadow-md', 'border', 'border-slate-200', 'p-4')}>
          <div className={cn('flex', 'items-center', 'gap-3')}>
            <SparklesIcon className={cn('w-5', 'h-5', 'text-pink-500')} />
            <div>
              <p className={cn('text-xs', 'text-slate-500')}>Joyride Slots</p>
              <p className={cn('font-semibold', 'text-slate-800')}>{stats.totalJoyrideSlots}</p>
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-xl', 'shadow-md', 'border', 'border-slate-200', 'p-4')}>
          <div className={cn('flex', 'items-center', 'gap-3')}>
            <CreditCardIcon className={cn('w-5', 'h-5', 'text-orange-500')} />
            <div>
              <p className={cn('text-xs', 'text-slate-500')}>Avg Rating</p>
              <p className={cn('font-semibold', 'text-slate-800')}>{stats.averageRating}/5</p>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-6')}>
        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'overflow-hidden')}>
          <div className={cn('bg-gradient-to-r', 'from-blue-50', 'to-indigo-50', 'px-6', 'py-4', 'border-b', 'border-slate-200')}>
            <h3 className={cn('text-lg', 'font-semibold', 'text-slate-800')}>Weekly Bookings</h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              {loading ? (
                <div className={cn('flex', 'justify-center', 'items-center', 'h-full')}>
                  <div className={cn('w-8', 'h-8', 'border-4', 'border-blue-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
                </div>
              ) : (
                <Bar data={bookingsByDay} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'overflow-hidden')}>
          <div className={cn('bg-gradient-to-r', 'from-purple-50', 'to-pink-50', 'px-6', 'py-4', 'border-b', 'border-slate-200')}>
            <h3 className={cn('text-lg', 'font-semibold', 'text-slate-800')}>Revenue Trend (7 Days)</h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              {loading ? (
                <div className={cn('flex', 'justify-center', 'items-center', 'h-full')}>
                  <div className={cn('w-8', 'h-8', 'border-4', 'border-purple-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
                </div>
              ) : (
                <Line data={revenueTrend} options={lineChartOptions} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-6')}>
        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'overflow-hidden')}>
          <div className={cn('bg-gradient-to-r', 'from-emerald-50', 'to-teal-50', 'px-6', 'py-4', 'border-b', 'border-slate-200')}>
            <h3 className={cn('text-lg', 'font-semibold', 'text-slate-800')}>Booking Status</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              {loading ? (
                <div className={cn('flex', 'justify-center', 'items-center', 'h-full')}>
                  <div className={cn('w-8', 'h-8', 'border-4', 'border-emerald-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
                </div>
              ) : (
                <Doughnut data={bookingStatusData} options={doughnutOptions} />
              )}
            </div>
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'overflow-hidden')}>
          <div className={cn('bg-gradient-to-r', 'from-slate-50', 'to-blue-50', 'px-6', 'py-4', 'border-b', 'border-slate-200')}>
            <h3 className={cn('text-lg', 'font-semibold', 'text-slate-800')}>Quick Actions</h3>
          </div>
          <div className={cn('p-6', 'space-y-3')}>
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className={cn('flex', 'items-center', 'gap-3', 'p-3', 'rounded-xl', 'border', 'border-slate-200', 'hover:border-blue-300', 'hover:bg-blue-50', 'transition-all', 'duration-200')}
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className={cn('font-semibold', 'text-slate-800', 'text-sm')}>{action.title}</h4>
                  <p className={cn('text-xs', 'text-slate-500')}>{action.description}</p>
                </div>
                <ArrowRightIcon className={cn('w-4', 'h-4', 'text-slate-400')} />
              </Link>
            ))}
          </div>
        </div>

        <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'overflow-hidden')}>
          <div className={cn('bg-gradient-to-r', 'from-orange-50', 'to-red-50', 'px-6', 'py-4', 'border-b', 'border-slate-200')}>
            <h3 className={cn('text-lg', 'font-semibold', 'text-slate-800')}>Recent Bookings</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className={cn('flex', 'justify-center', 'py-8')}>
                <div className={cn('w-6', 'h-6', 'border-4', 'border-orange-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
              </div>
            ) : recentBookingsList.length > 0 ? (
              <div className="space-y-3">
                {recentBookingsList.map((booking, index) => (
                  <div key={booking.id || index} className={cn('flex', 'items-center', 'justify-between', 'p-3', 'bg-slate-50', 'rounded-lg')}>
                    <div>
                      <p className={cn('font-medium', 'text-slate-800', 'text-sm')}>#{booking.bookingNo || booking.id}</p>
                      <p className={cn('text-xs', 'text-slate-500')}>
                        {booking.pnr || 'N/A'} • {new Date(booking.created_at || booking.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.bookingStatus === 'CONFIRMED'
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
              <div className={cn('text-center', 'py-8', 'text-slate-500')}>
                <TicketIcon className={cn('w-12', 'h-12', 'mx-auto', 'mb-2', 'text-slate-300')} />
                <p>No recent bookings</p>
              </div>
            )}
            <div className={cn('mt-4', 'pt-4', 'border-t', 'border-slate-200')}>
              <Link
                href="/admin-dashboard/booking-list"
                className={cn('text-sm', 'text-orange-600', 'hover:text-orange-800', 'font-medium', 'flex', 'items-center', 'justify-center', 'gap-1')}
              >
                View all bookings
                <ArrowRightIcon className={cn('w-4', 'h-4')} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('bg-gradient-to-r', 'from-slate-50', 'to-blue-50', 'rounded-2xl', 'border', 'border-blue-200', 'p-6')}>
        <div className={cn('flex', 'items-start', 'gap-3')}>
          <div className={cn('p-2', 'bg-blue-100', 'rounded-lg')}>
            <ChartBarIcon className={cn('w-5', 'h-5', 'text-blue-600')} />
          </div>
          <div className="flex-1">
            <h3 className={cn('font-semibold', 'text-blue-800', 'mb-2')}>System Overview</h3>
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-5', 'gap-4', 'text-sm')}>
              <div>
                <span className={cn('text-blue-700', 'font-medium')}>Recent Activity:</span>
                <span className={cn('ml-2', 'text-blue-600')}>{stats.recentBookings + stats.recentJoyrideBookings} bookings (7 days)</span>
              </div>
              <div>
                <span className={cn('text-blue-700', 'font-medium')}>Confirmed Rate:</span>
                <span className={cn('ml-2', 'text-blue-600')}>
                  {stats.totalBookings > 0 ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) : 0}%
                </span>
              </div>
              <div>
                <span className={cn('text-blue-700', 'font-medium')}>Payment Revenue:</span>
                <span className={cn('ml-2', 'text-blue-600')}>₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className={cn('text-blue-700', 'font-medium')}>Joyride Revenue:</span>
                <span className={cn('ml-2', 'text-blue-600')}>₹{stats.joyrideRevenue.toLocaleString('en-IN')}</span>
              </div>
              {stats.bookingRevenue > 0 && (
                <div>
                  <span className={cn('text-blue-700', 'font-medium')}>Booking Revenue:</span>
                  <span className={cn('ml-2', 'text-blue-600')}>₹{stats.bookingRevenue.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Data Debug Info - Remove in production */}
            {!loading && (stats.combinedRevenue === 0 || payments.length === 0) && (
              <div className={cn('mt-4', 'p-3', 'bg-amber-50', 'border', 'border-amber-200', 'rounded-lg')}>
                <p className={cn('text-amber-800', 'text-xs', 'font-medium', 'mb-2')}>Debug Info:</p>
                <div className={cn('text-xs', 'text-amber-700', 'space-y-1')}>
                  <div>Payments in DB: {payments.length}</div>
                  <div>Joyride Bookings in DB: {joyrideBookings.length}</div>
                  <div>Sample Payment Fields: {payments[0] ? Object.keys(payments[0]).join(', ') : 'No payments'}</div>
                  <div>Sample Joyride Fields: {joyrideBookings[0] ? Object.keys(joyrideBookings[0]).join(', ') : 'No joyrides'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}