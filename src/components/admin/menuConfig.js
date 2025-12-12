import { ToyBrickIcon } from "lucide-react";
import {
    FaBook,
    FaCalendarAlt,
    FaChartBar,
    FaClock,
    FaCog,
    FaDollarSign,
    FaExclamationTriangle,
    FaFileAlt,
    FaHome,
    FaMapMarkerAlt,
    FaPlane,
    FaTicketAlt,
    FaUsers,
    FaUserShield
} from "react-icons/fa";

/**
 * Centralized menu configuration
 * Makes it easy to add/remove/modify menu items
 */
export const menuConfig = {
    dashboard: {
        title: "Dashboard",
        items: [
            {
                href: "/admin-dashboard",
                icon: FaHome,
                label: "Overview",
                iconColor: "text-blue-400",
            },
        ],
    },

    flightManagement: {
        title: "Flight Management",
        items: [
            {
                href: "/admin-dashboard/add-airport",
                icon: FaMapMarkerAlt,
                label: "Airport Management",
                iconColor: "text-emerald-400",
            },
            {
                href: "/admin-dashboard/add-flight",
                icon: FaPlane,
                label: "Flight Management",
                iconColor: "text-sky-400",
            },
            {
                href: "/admin-dashboard/scheduled-flight",
                icon: FaCalendarAlt,
                label: "Scheduled Flights",
                iconColor: "text-purple-400",
            },
            {
                href: "/admin-dashboard/schedule-exceptions",
                icon: FaClock,
                label: "Schedule Cancellation",
                iconColor: "text-purple400",

            },
        ],
    },

    bookingManagement: {
        title: "Booking Management",
        items: [
            {
                href: "/admin-dashboard/booking-list",
                icon: FaBook,
                label: "All Bookings",
                iconColor: "text-orange-400",
            },
            {
                href: "/admin-dashboard/booking-data",
                icon: FaChartBar,
                label: "Booking Analytics",
                iconColor: "text-pink-400",
            },
            {
                href: "/admin-dashboard/tickets",
                icon: FaTicketAlt,
                label: "Flight Tickets",
                iconColor: "text-yellow-400",
            },
            {
                href: "/admin-dashboard/helicopter-tickets",
                icon: FaTicketAlt,
                label: "Helicopter Tickets",
                iconColor: "text-purple-400",
                activeGradient: "from-purple-600 to-pink-600",
            },
            {
                href: "/admin-dashboard/create-ticket",
                icon: FaTicketAlt,
                label: "Create Ticket",
                iconColor: "text-green-400",
            },
            {
                href: "/admin-dashboard/refunds",
                icon: FaDollarSign,
                label: "Refund Management",
                iconColor: "text-green-400",
            },
            {
                href: "/admin-dashboard/coupons",
                icon: FaTicketAlt,
                label: "Coupon Management",
                iconColor: "text-purple-400",
            },
            {
                href: "/admin-dashboard/helicopter-booking",
                icon: FaPlane,
                label: "Helicopter Bookings",
                iconColor: "text-red-400",
                iconClassName: "rotate-45",
            },
            {
                href: "/admin-dashboard/reschedule-booking",
                icon: FaClock,
                label: "Reschedule Booking",
                iconColor: "text-orange-400",
                activeGradient: "from-orange-600 to-red-600",
            },
        ],
    },

    helicopterManagement: {
        title: "Helicopter Management",
        items: [
            {
                href: "/admin-dashboard/helipad-management",
                icon: FaMapMarkerAlt,
                label: "Helipad Management",
                iconColor: "text-orange-400",
            },
            {
                href: "/admin-dashboard/helicopter-management",
                icon: FaPlane,
                label: "Helicopter Management",
                iconColor: "text-red-400",
                iconClassName: "rotate-45",
            },
            {
                href: "/admin-dashboard/helicopter-schedule",
                icon: FaCalendarAlt,
                label: "Helicopter Schedule",
                iconColor: "text-green-400",
            },
        ],
    },

    joyRideServices: {
        title: "Joy Ride Services",
        items: [
            {
                href: "/admin-dashboard/bookid-joyride",
                icon: ToyBrickIcon,
                label: "Joy Ride Booking",
                iconColor: "text-green-400",
            },
            {
                href: "/admin-dashboard/all-joyride-slots",
                icon: FaClock,
                label: "Available Slots",
                iconColor: "text-cyan-400",
            },
            {
                href: "/admin-dashboard/all-joyride-booking",
                icon: FaBook,
                label: "Joy Ride Bookings",
                iconColor: "text-rose-400",
            },
        ],
    },

    userManagement: {
        title: "User Management",
        items: [
            {
                href: "/admin-dashboard/all-users",
                icon: FaUsers,
                label: "Manage Users",
                iconColor: "text-indigo-400",
            },
            {
                href: "/admin-dashboard/agents",
                icon: FaUserShield,
                label: "Agent Management",
                iconColor: "text-emerald-400",
            },
        ],
    },

    systemSettings: {
        title: "System Settings",
        items: [
            {
                href: "/admin-dashboard/booking-settings",
                icon: FaCog,
                label: "Booking Settings",
                iconColor: "text-yellow-400",
            },
            {
                href: "/admin-dashboard/schedule-management",
                icon: FaBook,
                label: "Schedule Management",
                iconColor: "text-indigo-400",
                activeGradient: "from-indigo-600 to-purple-600",
            },
        ],
    },

    logsAndMonitoring: {
        title: "Logs & Monitoring",
        items: [
            {
                href: "/admin-dashboard/system-logs",
                icon: FaFileAlt,
                label: "System Logs",
                iconColor: "text-blue-400",
                activeGradient: "from-blue-600 to-cyan-600",
            },
            {
                href: "/admin-dashboard/user-activity",
                icon: FaUsers,
                label: "User Activity",
                iconColor: "text-green-400",
                activeGradient: "from-green-600 to-emerald-600",
            },
            {
                href: "/admin-dashboard/error-logs",
                icon: FaExclamationTriangle,
                label: "Error Logs",
                iconColor: "text-red-400",
                activeGradient: "from-red-600 to-pink-600",
            },
        ],
    },
};
