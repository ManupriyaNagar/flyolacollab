"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TicketIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function OperationsDashboard() {
  const [flightBookings, setFlightBookings] = useState([]);
  const [helicopterBookings, setHelicopterBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || authState.userRole !== "8")) {
      router.push("/sign-in");
    }
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole, router]);

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn || authState.userRole !== "8") {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token") || "";
        if (!token) {
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

        const [flightRes, helicopterRes] = await Promise.all([
          fetch(`${BASE_URL}/bookings`, commonOpts),
          fetch(`${BASE_URL}/bookings/helicopter-bookings`, commonOpts),
        ]);

        if (!flightRes.ok || !helicopterRes.ok) {
          if (flightRes.status === 401 || helicopterRes.status === 401) {
            localStorage.removeItem("token");
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed to fetch bookings data");
        }

        const flightData = await flightRes.json();
        const helicopterData = await helicopterRes.json();

        setFlightBookings(Array.isArray(flightData) ? flightData : []);
        setHelicopterBookings(Array.isArray(helicopterData) ? helicopterData : []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole, router]);

  const stats = useMemo(() => {
    const totalFlightBookings = flightBookings.length;
    const totalHelicopterBookings = helicopterBookings.length;
    const totalBookings = totalFlightBookings + totalHelicopterBookings;

    const confirmedFlights = flightBookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
    const confirmedHelicopters = helicopterBookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
    const totalConfirmed = confirmedFlights + confirmedHelicopters;

    const pendingFlights = flightBookings.filter(b => b.bookingStatus === 'PENDING').length;
    const pendingHelicopters = helicopterBookings.filter(b => b.bookingStatus === 'PENDING').length;
    const totalPending = pendingFlights + pendingHelicopters;

    const cancelledFlights = flightBookings.filter(b => b.bookingStatus === 'CANCELLED').length;
    const cancelledHelicopters = helicopterBookings.filter(b => b.bookingStatus === 'CANCELLED').length;
    const totalCancelled = cancelledFlights + cancelledHelicopters;

    return {
      totalFlightBookings,
      totalHelicopterBookings,
      totalBookings,
      confirmedFlights,
      confirmedHelicopters,
      totalConfirmed,
      pendingFlights,
      pendingHelicopters,
      totalPending,
      cancelledFlights,
      cancelledHelicopters,
      totalCancelled,
    };
  }, [flightBookings, helicopterBookings]);

  const bookingsByType = useMemo(() => {
    return {
      labels: ['Flight Bookings', 'Helicopter Bookings'],
      datasets: [
        {
          label: "Bookings by Type",
          data: [stats.totalFlightBookings, stats.totalHelicopterBookings],
          backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(168, 85, 247, 0.8)"],
          borderColor: ["rgba(59, 130, 246, 1)", "rgba(168, 85, 247, 1)"],
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }, [stats]);

  const bookingStatusData = useMemo(() => {
    return {
      labels: ['Confirmed', 'Pending', 'Cancelled'],
      datasets: [
        {
          data: [stats.totalConfirmed, stats.totalPending, stats.totalCancelled],
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
  }, [stats]);

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

  if (authState.isLoading || !authState.isLoggedIn || authState.userRole !== "8") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            MP Tourism Portal
          </h1>
          <p className="text-slate-600 mt-2">Madhya Pradesh Tourism - Flight and Helicopter Operations Overview</p>
        </div>

        <div className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Bookings</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? "--" : stats.totalBookings}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <TicketIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">{stats.totalFlightBookings} Flights</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-slate-600">{stats.totalHelicopterBookings} Helicopters</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Confirmed</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">
                {loading ? "--" : stats.totalConfirmed}
              </h3>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <div>Flights: {stats.confirmedFlights}</div>
            <div>Helicopters: {stats.confirmedHelicopters}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <h3 className="text-3xl font-bold text-yellow-600 mt-1">
                {loading ? "--" : stats.totalPending}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <TicketIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <div>Flights: {stats.pendingFlights}</div>
            <div>Helicopters: {stats.pendingHelicopters}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Cancelled</p>
              <h3 className="text-3xl font-bold text-red-600 mt-1">
                {loading ? "--" : stats.totalCancelled}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TicketIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <div>Flights: {stats.cancelledFlights}</div>
            <div>Helicopters: {stats.cancelledHelicopters}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Bookings by Type</h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <Bar data={bookingsByType} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Booking Status</h3>
          </div>
          <div className="p-6">
            <div className="h-80">
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
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Quick Access</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/operations-dashboard/flight-bookings"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="p-3 bg-blue-100 rounded-lg">
              <TicketIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Flight Bookings</h4>
              <p className="text-sm text-slate-500">View all flight bookings</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-slate-400" />
          </Link>

          <Link
            href="/operations-dashboard/helicopter-bookings"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <div className="p-3 bg-purple-100 rounded-lg">
              <TicketIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Helicopter Bookings</h4>
              <p className="text-sm text-slate-500">View all helicopter bookings</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-slate-400" />
          </Link>

          <Link
            href="/operations-dashboard/flight-tickets"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200"
          >
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TicketIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Flight Tickets</h4>
              <p className="text-sm text-slate-500">Download flight tickets</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-slate-400" />
          </Link>

          <Link
            href="/operations-dashboard/helicopter-tickets"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200"
          >
            <div className="p-3 bg-pink-100 rounded-lg">
              <TicketIcon className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Helicopter Tickets</h4>
              <p className="text-sm text-slate-500">Download helicopter tickets</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
