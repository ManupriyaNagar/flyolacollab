"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCalendarDay, FaChartLine, FaHelicopter, FaPlane, FaTicketAlt } from "react-icons/fa";

export default function OperationsDashboardPage() {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayFlights: 0,
    tomorrowFlights: 0,
    todayHelicopters: 0,
    tomorrowHelicopters: 0,
  });

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn) return;

    const fetchBookingStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        
        // Use optimized stats endpoint - single API call instead of 4!
        // This endpoint uses SQL COUNT which is much faster than fetching all records
        const response = await fetch(`${BASE_URL}/bookings/stats/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          setStats({
            todayFlights: data.today.flights,
            tomorrowFlights: data.tomorrow.flights,
            todayHelicopters: data.today.helicopters,
            tomorrowHelicopters: data.tomorrow.helicopters,
          });
        } else {
          console.error("Failed to fetch booking stats");
        }
      } catch (error) {
        console.error("Error fetching booking stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStats();
  }, [authState]);

  const quickLinks = [
    {
      title: "Flight Bookings",
      icon: FaPlane,
      color: "from-blue-500 to-indigo-600",
      link: "/operations-dashboard/flight-bookings",
    },
    {
      title: "Flight Tickets",
      icon: FaTicketAlt,
      color: "from-yellow-500 to-orange-600",
      link: "/operations-dashboard/flight-tickets",
    },
    {
      title: "Helicopter Bookings",
      icon: FaHelicopter,
      color: "from-purple-500 to-pink-600",
      link: "/operations-dashboard/helicopter-bookings",
    },
    {
      title: "Helicopter Tickets",
      icon: FaTicketAlt,
      color: "from-red-500 to-pink-600",
      link: "/operations-dashboard/helicopter-tickets",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'mb-2')}>
          Welcome to Operations Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time overview of today's and tomorrow's flight operations
        </p>
      </div>

      {/* Today's and Tomorrow's Bookings Summary */}
      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
        {/* Today's Bookings */}
        <div className={cn('bg-gradient-to-br', 'from-blue-500', 'to-indigo-600', 'rounded-2xl', 'p-6', 'text-white', 'shadow-xl')}>
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-4')}>
            <div className={cn('w-12', 'h-12', 'bg-white/20', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
              <FaCalendarDay className="text-2xl" />
            </div>
            <div>
              <h2 className={cn('text-2xl', 'font-bold')}>Today's Bookings</h2>
              <p className={cn('text-blue-100', 'text-sm')}>
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
            <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-xl', 'p-4')}>
              <div className={cn('flex', 'items-center', 'gap-2', 'mb-2')}>
                <FaPlane className="text-lg" />
                <p className={cn('text-blue-100', 'text-sm')}>Flights</p>
              </div>
              {loading ? (
                <div className={cn('h-8', 'w-16', 'bg-white/20', 'rounded', 'animate-pulse')}></div>
              ) : (
                <p className={cn('text-4xl', 'font-bold')}>{stats.todayFlights}</p>
              )}
            </div>
            
            <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-xl', 'p-4')}>
              <div className={cn('flex', 'items-center', 'gap-2', 'mb-2')}>
                <FaHelicopter className="text-lg" />
                <p className={cn('text-blue-100', 'text-sm')}>Helicopters</p>
              </div>
              {loading ? (
                <div className={cn('h-8', 'w-16', 'bg-white/20', 'rounded', 'animate-pulse')}></div>
              ) : (
                <p className={cn('text-4xl', 'font-bold')}>{stats.todayHelicopters}</p>
              )}
            </div>
          </div>

          <div className={cn('mt-4', 'pt-4', 'border-t', 'border-white/20')}>
            <p className={cn('text-blue-100', 'text-sm')}>Total Today</p>
            <p className={cn('text-3xl', 'font-bold')}>
              {loading ? "..." : stats.todayFlights + stats.todayHelicopters}
            </p>
          </div>
        </div>

        {/* Tomorrow's Bookings */}
        <div className={cn('bg-gradient-to-br', 'from-orange-500', 'to-orange-600', 'rounded-2xl', 'p-6', 'text-white', 'shadow-xl')}>
          <div className={cn('flex', 'items-center', 'gap-3', 'mb-4')}>
            <div className={cn('w-12', 'h-12', 'bg-white/20', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
              <FaCalendarAlt className="text-2xl" />
            </div>
            <div>
              <h2 className={cn('text-2xl', 'font-bold')}>Tomorrow's Bookings</h2>
              <p className={cn('text-purple-100', 'text-sm')}>
                {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
            <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-xl', 'p-4')}>
              <div className={cn('flex', 'items-center', 'gap-2', 'mb-2')}>
                <FaPlane className="text-lg" />
                <p className={cn('text-purple-100', 'text-sm')}>Flights</p>
              </div>
              {loading ? (
                <div className={cn('h-8', 'w-16', 'bg-white/20', 'rounded', 'animate-pulse')}></div>
              ) : (
                <p className={cn('text-4xl', 'font-bold')}>{stats.tomorrowFlights}</p>
              )}
            </div>
            
            <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-xl', 'p-4')}>
              <div className={cn('flex', 'items-center', 'gap-2', 'mb-2')}>
                <FaHelicopter className="text-lg" />
                <p className={cn('text-purple-100', 'text-sm')}>Helicopters</p>
              </div>
              {loading ? (
                <div className={cn('h-8', 'w-16', 'bg-white/20', 'rounded', 'animate-pulse')}></div>
              ) : (
                <p className={cn('text-4xl', 'font-bold')}>{stats.tomorrowHelicopters}</p>
              )}
            </div>
          </div>

          <div className={cn('mt-4', 'pt-4', 'border-t', 'border-white/20')}>
            <p className={cn('text-purple-100', 'text-sm')}>Total Tomorrow</p>
            <p className={cn('text-3xl', 'font-bold')}>
              {loading ? "..." : stats.tomorrowFlights + stats.tomorrowHelicopters}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-4')}>Quick Access</h2>
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')}>
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={index}
                href={link.link}
                className={cn('group', 'relative', 'overflow-hidden', 'rounded-2xl', 'bg-white', 'p-6', 'shadow-lg', 'hover:shadow-xl', 'transition-all', 'duration-300', 'border', 'border-gray-100', 'hover:scale-105')}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={cn('text-white', 'text-xl')} />
                  </div>
                  
                  <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900', 'mb-2')}>
                    {link.title}
                  </h3>
                  
                  <div className={cn('flex', 'items-center', 'text-sm', 'text-gray-600', 'group-hover:text-blue-600', 'transition-colors')}>
                    <span>View Details</span>
                    <svg
                      className={cn('w-4', 'h-4', 'ml-1', 'group-hover:translate-x-1', 'transition-transform')}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Operations Status */}
      <div className={cn('bg-gradient-to-r', 'from-emerald-500', 'to-teal-600', 'rounded-2xl', 'p-8', 'text-white')}>
        <div className={cn('flex', 'items-center', 'gap-4', 'mb-4')}>
          <div className={cn('w-12', 'h-12', 'bg-white/20', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
            <FaChartLine className="text-2xl" />
          </div>
          <div>
            <h2 className={cn('text-2xl', 'font-bold')}>Operations Status</h2>
            <p className="text-emerald-100">All systems operational</p>
          </div>
        </div>
        
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-6', 'mt-6')}>
          <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-xl', 'p-4')}>
            <p className={cn('text-emerald-100', 'text-sm', 'mb-1')}>Total Bookings (2 Days)</p>
            <p className={cn('text-3xl', 'font-bold')}>
              {loading ? "..." : stats.todayFlights + stats.tomorrowFlights + stats.todayHelicopters + stats.tomorrowHelicopters}
            </p>
          </div>
          <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-xl', 'p-4')}>
            <p className={cn('text-emerald-100', 'text-sm', 'mb-1')}>Flight Operations</p>
            <p className={cn('text-3xl', 'font-bold')}>
              {loading ? "..." : stats.todayFlights + stats.tomorrowFlights}
            </p>
          </div>
          <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-xl', 'p-4')}>
            <p className={cn('text-emerald-100', 'text-sm', 'mb-1')}>Helicopter Operations</p>
            <p className={cn('text-3xl', 'font-bold')}>
              {loading ? "..." : stats.todayHelicopters + stats.tomorrowHelicopters}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
