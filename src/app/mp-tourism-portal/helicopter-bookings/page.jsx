"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useAuth } from "@/components/AuthContext";
import BookingDetailsModal from "@/components/BookingDetailsModal";
import { cn } from "@/lib/utils";
import {
    ArrowDownTrayIcon,
    ArrowsUpDownIcon,
    BanknotesIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    CreditCardIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    UserGroupIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const BOOKINGS_PER_PAGE = 50;

export default function HelicopterBookingsPage() {
    const { authState } = useAuth();
    const router = useRouter();

    const [allData, setAllData] = useState([]);
    const [status, setStatus] = useState("All Booking");
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [helipadMap, setHelipadMap] = useState({});
    const [helicopterMap, setHelicopterMap] = useState({});
    const [paymentMap, setPaymentMap] = useState({});
    const [agentMap, setAgentMap] = useState({});
    const [userRoleMap, setUserRoleMap] = useState({});
    const [selectedAgent, setSelectedAgent] = useState("all");
    const [selectedRole, setSelectedRole] = useState("all");
    const [downloadRange, setDownloadRange] = useState("page");
    const [error, setError] = useState(null);
    const [bookingDateRange, setBookingDateRange] = useState([null, null]);
    const [flightDateRange, setFlightDateRange] = useState([null, null]);
    const [selectedDepartureHelipad, setSelectedDepartureHelipad] = useState("all");
    const [selectedArrivalHelipad, setSelectedArrivalHelipad] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const [startBookingDate, endBookingDate] = bookingDateRange;
    const [startFlightDate, endFlightDate] = flightDateRange;

    // Redirect if not admin
    useEffect(() => {
        if (!authState.isLoading && (!authState.isLoggedIn || authState.userRole !== "8")) {
            router.push("/sign-in");
        }
    }, [authState.isLoading, authState.isLoggedIn, authState.userRole]);

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchTerm(value);
            setCurrentPage(1);
        }, 300),
        []
    );


    useEffect(() => {
        // only run when fully authenticated & admin
        if (
            authState.isLoading ||
            !authState.isLoggedIn ||
            authState.userRole !== "8"
        ) {
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // grab token
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found. Please log in again.");
                }

                const commonOpts = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };

                const endpoints = [
                    `${BASE_URL}/bookings/helicopter-bookings?status=${status}`, // 0 - Changed to helicopter-bookings endpoint
                    `${BASE_URL}/booked-seat`,               // 1
                    `${BASE_URL}/passenger`,                 // 2
                    `${BASE_URL}/helipads`,                  // 3
                    `${BASE_URL}/agents`,                    // 4
                    `${BASE_URL}/payments`,                  // 5
                    `${BASE_URL}/helicopters`,               // 6
                    `${BASE_URL}/users/all`,                 // 7
                    `${BASE_URL}/helicopter-schedules`,      // 8
                ];

                // 1) fetch all
                const responses = await Promise.all(
                    endpoints.map((url) =>
                        fetch(url, commonOpts).catch((err) => ({
                            ok: false,
                            status: 500,
                            statusText: err.message,
                        }))
                    )
                );

                // 2) parse all, handle 401/403 specially
                const data = await Promise.all(
                    responses.map(async (res, idx) => {
                        if (!res.ok) {
                            // auth errors
                            if (res.status === 401) {
                                throw new Error("Authentication failed. Please log in again.");
                            }
                            if (res.status === 403) {
                                throw new Error("Access denied. Admin privileges required.");
                            }
                            // non­critical endpoints return empty array
                            if ([1, 2, 4, 5].includes(idx)) {
                                return [];
                            }
                            // critical endpoints everything else
                            throw new Error(
                                `Failed to fetch ${endpoints[idx]}: ${res.status} ${res.statusText}`
                            );
                        }

                        // parse JSON
                        try {
                            const json = await res.json();
                            // passenger endpoint wraps in .data
                            if (idx === 2) {
                                return json.data || json || [];
                            }
                            return Array.isArray(json) ? json : [];
                        } catch {
                            return [];
                        }
                    })
                );

                // 3) destructure
                const [
                    bookingsData,
                    seatData,
                    paxData,
                    helipadData,
                    agentData,
                    paymentData,
                    helicopterData,
                    usersData,
                    helicopterScheduleData,
                ] = data;

                // 4) build maps
                const userRoleMap = Object.fromEntries(
                    usersData.map((u) => [u.id, String(u.role)])
                );
                const helicopterNumberMap = Object.fromEntries(
                    helicopterData
                        .filter((h) => h.id && h.helicopter_number)
                        .map((h) => [h.id, h.helicopter_number])
                );
                const helipadMap = Object.fromEntries(
                    helipadData
                        .filter((h) => h.id && h.city)
                        .map((h) => [h.id, h.city])
                );
                const agentMap = Object.fromEntries(
                    agentData
                        .filter((a) => a.id && a.agentId)
                        .map((a) => [a.id, a.agentId])
                );
                const paymentMap = Object.fromEntries(
                    paymentData
                        .filter((p) => p.booking_id && p.transaction_id)
                        .map((p) => [p.booking_id, p.transaction_id])
                );

                // Create helicopter schedule map and Set of IDs
                const helicopterScheduleMap = new Map();
                const helicopterScheduleIds = new Set();
                
                helicopterScheduleData.forEach(schedule => {
                    if (schedule && schedule.id) {
                        helicopterScheduleMap.set(schedule.id, schedule);
                        helicopterScheduleIds.add(schedule.id);
                    }
                });

                console.log('Helicopter Schedule IDs:', Array.from(helicopterScheduleIds));
                console.log('Total helicopter schedules:', helicopterScheduleIds.size);

                // stash maps if you need them elsewhere
                setHelipadMap(helipadMap);
                setHelicopterMap(helicopterNumberMap);
                setPaymentMap(paymentMap);
                setAgentMap(agentMap);
                setUserRoleMap(userRoleMap);

                // 5) All bookings from /helicopter-bookings endpoint are already helicopter bookings
                // No need to filter - backend returns only helicopter bookings from helicopter_bookings table
                const helicopterBookings = bookingsData;

                console.log(`Total helicopter bookings: ${helicopterBookings.length}`);
                console.log('Helicopter booking IDs:', helicopterBookings.map(b => b.bookingNo));

                // If no helicopter bookings found, set empty array and return early
                if (helicopterBookings.length === 0) {
                    setAllData([]);
                    setCurrentPage(1);
                    toast.info("No helicopter bookings found");
                    setIsLoading(false);
                    return;
                }

                // 6) Merge helicopter bookings with related data
                const merged = helicopterBookings.map((booking) => {
                    // Backend already includes HelicopterSchedule in the response
                    const schedule = booking.HelicopterSchedule || helicopterScheduleMap.get(booking.helicopter_schedule_id) || {};
                    
                    const passengers = Array.isArray(booking.Passengers)
                        ? booking.Passengers.filter((p) => p?.name)
                        : paxData.filter(
                            (p) =>
                                p?.bookingId &&
                                String(p.bookingId) === String(booking.id)
                        );

                    const seatLabels = Array.isArray(booking.BookedSeats)
                        ? booking.BookedSeats.map((s) => s.seat_label).join(", ")
                        : "N/A";

                    return {
                        ...booking,
                        helicopterSchedule: schedule,
                        booked_seat: seatLabels,
                        passengers,
                        helicopterNumber: helicopterNumberMap[schedule.helicopter_id] || "N/A",
                        billingName: booking.billing?.billing_name || "N/A",
                        paymentMode: booking.Payments?.[0]?.payment_mode || booking.pay_mode || "N/A",
                        agentId: agentMap[booking.agentId] || "FLYOLA",
                        userRole: userRoleMap[booking.bookedUserId] || "Unknown",
                        paymentId: booking.Payments?.[0]?.payment_id || booking.paymentId || "N/A",
                        transactionId: booking.transactionId || paymentMap[booking.id] || "N/A",
                        departureHelipadName: helipadMap[schedule.departure_helipad_id] || "N/A",
                        arrivalHelipadName: helipadMap[schedule.arrival_helipad_id] || "N/A",
                        bookingSource: "FLYOLA",
                    };
                });

                // 6) sort by latest flight date first, then by booking date
                const sortedMerged = merged.sort((a, b) => {
                    // First sort by flight date (bookDate) - latest first
                    const aFlightDate = a.bookDate ? new Date(a.bookDate) : new Date(0);
                    const bFlightDate = b.bookDate ? new Date(b.bookDate) : new Date(0);

                    if (aFlightDate.getTime() !== bFlightDate.getTime()) {
                        return bFlightDate - aFlightDate; // Latest flight date first
                    }

                    // If flight dates are same, sort by booking creation date - latest first
                    const aCreated = new Date(a.created_at);
                    const bCreated = new Date(b.created_at);
                    return bCreated - aCreated;
                });

                // 7) commit
                setAllData(sortedMerged);
                setCurrentPage(1);
                toast.success(`Successfully loaded ${sortedMerged.length} helicopter bookings`);
            } catch (err) {
                const msg = err.message || "Failed to load data. Please try again.";
                setError(msg);

                // auth redirect
                if (
                    msg.includes("Authentication") ||
                    msg.includes("Access denied")
                ) {
                    toast.error("Session expired. Redirecting to sign‑in…");
                    setTimeout(() => router.push("/sign-in"), 2000);
                } else {
                    toast.error(msg);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [status, authState.isLoggedIn, authState.userRole, router]);


    // Date filter helper
    const getDateFilterRange = (filter) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        switch (filter) {
            case "today": return { start: today, end: today };
            case "tomorrow": return { start: tomorrow, end: tomorrow };
            case "yesterday": return { start: yesterday, end: yesterday };
            case "custom": return startBookingDate && endBookingDate ? { start: startBookingDate, end: endBookingDate } : null;
            default: return null;
        }
    };

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle view booking
    const handleViewBooking = (booking) => {
        setSelectedBooking(booking);
        setShowBookingModal(true);
    };

    // Filtered data
    const filteredData = useMemo(() => {
        let data = allData;

        // Agent filter
        if (selectedAgent !== "all") {
            data = data.filter((item) => item.agentId === selectedAgent);
        }

        // Role filter
        if (selectedRole !== "all") {
            data = data.filter((item) => item.userRole === selectedRole);
        }

        // Departure helipad filter
        if (selectedDepartureHelipad !== "all") {
            data = data.filter((item) =>
                item.helicopterSchedule?.departure_helipad_id?.toString() === selectedDepartureHelipad
            );
        }

        // Arrival helipad filter
        if (selectedArrivalHelipad !== "all") {
            data = data.filter((item) =>
                item.helicopterSchedule?.arrival_helipad_id?.toString() === selectedArrivalHelipad
            );
        }

        // Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            data = data.filter((item) =>
                [
                    item.bookingNo?.toString().toLowerCase(),
                    item.pnr?.toLowerCase(),
                    item.email_id?.toLowerCase(),
                    item.contact_no?.toString().toLowerCase(),
                    item.passengers?.map((p) => p.name?.toLowerCase()).join(" "),
                    item.billingName?.toLowerCase(),
                    item.transactionId?.toLowerCase(),
                    item.agentId?.toLowerCase(),
                    item.userRole?.toLowerCase(),
                    item.helicopterNumber?.toLowerCase(),
                    item.departureHelipadName?.toLowerCase(),
                    item.arrivalHelipadName?.toLowerCase(),
                ].some((field) => field?.includes(term))
            );
        }

        // Booking date range filter (filters by when booking was created)
        if (startBookingDate && endBookingDate) {
            data = data.filter((item) => {
                if (!item.created_at) return false;
                const createdAt = new Date(item.created_at);
                createdAt.setHours(0, 0, 0, 0);
                const start = new Date(startBookingDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(endBookingDate);
                end.setHours(23, 59, 59, 999);
                return createdAt >= start && createdAt <= end;
            });
        }

        // Flight date range filter (filters by flight departure date)
        if (startFlightDate && endFlightDate) {
            data = data.filter((item) => {
                if (!item.bookDate) return false;
                const flightDate = new Date(item.bookDate);
                flightDate.setHours(0, 0, 0, 0);
                const start = new Date(startFlightDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(endFlightDate);
                end.setHours(23, 59, 59, 999);
                return flightDate >= start && flightDate <= end;
            });
        }

        // Legacy download range filter (for backward compatibility)
        if (["today", "tomorrow", "yesterday", "custom"].includes(downloadRange)) {
            const dateRange = getDateFilterRange(downloadRange);
            if (dateRange && downloadRange !== "custom") {
                data = data.filter((item) => {
                    const createdAt = new Date(item.created_at);
                    createdAt.setHours(0, 0, 0, 0);
                    return (
                        createdAt.getTime() >= dateRange.start.getTime() &&
                        createdAt.getTime() <= dateRange.end.getTime()
                    );
                });
            }
        } else if (downloadRange.startsWith("month-")) {
            const [, year, month] = downloadRange.split("-");
            data = data.filter(
                (item) =>
                    new Date(item.created_at).getFullYear() === parseInt(year) &&
                    new Date(item.created_at).getMonth() === parseInt(month) - 1
            );
        } else if (downloadRange.startsWith("year-")) {
            const [, year] = downloadRange.split("-");
            data = data.filter((item) => new Date(item.created_at).getFullYear() === parseInt(year));
        }

        // Apply sorting
        if (sortConfig.key) {
            data.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle date sorting specially
                if (sortConfig.key === 'bookDate' || sortConfig.key === 'created_at') {
                    aValue = aValue ? new Date(aValue) : new Date(0);
                    bValue = bValue ? new Date(bValue) : new Date(0);
                } else if (sortConfig.key === 'totalFare' || sortConfig.key === 'noOfPassengers') {
                    // Handle numeric sorting
                    aValue = parseFloat(aValue) || 0;
                    bValue = parseFloat(bValue) || 0;
                } else if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue ? bValue.toLowerCase() : '';
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else {
            // Default sorting: latest flight date first, then latest booking date
            data.sort((a, b) => {
                const aFlightDate = a.bookDate ? new Date(a.bookDate) : new Date(0);
                const bFlightDate = b.bookDate ? new Date(b.bookDate) : new Date(0);

                if (aFlightDate.getTime() !== bFlightDate.getTime()) {
                    return bFlightDate - aFlightDate; // Latest flight date first
                }

                const aCreated = new Date(a.created_at);
                const bCreated = new Date(b.created_at);
                return bCreated - aCreated; // Latest booking first
            });
        }

        return data;
    }, [allData, searchTerm, downloadRange, startBookingDate, endBookingDate, startFlightDate, endFlightDate, selectedAgent, selectedRole, selectedDepartureHelipad, selectedArrivalHelipad, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / BOOKINGS_PER_PAGE) || 1;
    const currentData = useMemo(
        () => filteredData.slice((currentPage - 1) * BOOKINGS_PER_PAGE, currentPage * BOOKINGS_PER_PAGE),
        [filteredData, currentPage]
    );
    
    const exportToExcel = useCallback(() => {
        let exportData = downloadRange === "page" ? currentData : filteredData;
        let filename = `HelicopterBookings_${downloadRange === "page" ? `Page_${currentPage}` : downloadRange}${selectedAgent !== "all" ? `_Agent_${selectedAgent}` : ""}${selectedRole !== "all" ? `_Role_${selectedRole}` : ""}.xlsx`;

        if (!exportData.length) {
            toast.warn("No data available for the selected range.");
            return;
        }

        const data = exportData.map((item) => {
            const passengerNames = item.passengers?.length
                ? item.passengers.map((p) => p.name || "Unknown").join(", ")
                : "N/A";

            return {
                BookingId: item.bookingNo || "N/A",
                PNR: item.pnr || "N/A",
                FlightDate: item.bookDate ? new Date(item.bookDate).toLocaleDateString() : "N/A",
                BookingDate: item.created_at ? new Date(item.created_at).toLocaleString() : "N/A",
                Email: item.email_id || "N/A",
                ContactNumber: item.contact_no || "N/A",
                Passengers: item.noOfPassengers || 0,
                PassengerNames: passengerNames,
                BillingName: item.billingName || "N/A",
                BookedSeats: item.booked_seat || "N/A",
                TotalFare: item.totalFare ? parseFloat(item.totalFare).toFixed(2) : "N/A",
                BookingStatus: item.bookingStatus || "N/A",
                PaymentMode: item.paymentMode || "N/A",
                TransactionId: item.transactionId || "N/A",
                PaymentId: item.paymentId || "N/A",
                AgentId: item.agentId || "FLYOLA",
                UserRole: item.userRole === "1" ? "Admin" : item.userRole === "2" ? "Booking Agent" : item.userRole === "3" ? "Regular User" : "Unknown",
                HelicopterNumber: item.helicopterNumber || "N/A",
                DepartureTime: item.helicopterSchedule?.departure_time || "N/A",
                ArrivalTime: item.helicopterSchedule?.arrival_time || "N/A",
                DepartureHelipad: item.departureHelipadName || "N/A",
                ArrivalHelipad: item.arrivalHelipadName || "N/A",
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "HelicopterBookings");
        XLSX.writeFile(wb, filename);
        toast.success("Excel file downloaded successfully!");
    }, [currentData, filteredData, downloadRange, currentPage, selectedAgent, selectedRole]);

    // Download options
    const downloadOptions = useMemo(() => {
        const options = [
            { value: "page", label: "Current Page" },
            { value: "all", label: "All Data" },
            { value: "today", label: "Today" },
            { value: "tomorrow", label: "Tomorrow" },
            { value: "yesterday", label: "Yesterday" },
            { value: "custom", label: "Custom Date Range" },
        ];

        const yearMonthMap = new Map();
        filteredData.forEach((item) => {
            const date = new Date(item.created_at);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            if (!yearMonthMap.has(year)) yearMonthMap.set(year, new Set());
            yearMonthMap.get(year).add(month);
        });

        yearMonthMap.forEach((months, year) => {
            options.push({ value: `year-${year}`, label: `Year ${year}` });
            months.forEach((month) => {
                const monthName = new Date(0, month - 1).toLocaleString("default", { month: "long" });
                options.push({ value: `month-${year}-${month}`, label: `${monthName} ${year}` });
            });
        });

        return options;
    }, [filteredData]);

    // Agent options
    const agentOptions = useMemo(() => {
        const options = [{ value: "all", label: "All Agents" }];

        // Add IRCTC option
        options.push({ value: "IRCTC", label: "IRCTC" });

        // Add other agents from agentMap
        Object.entries(agentMap).forEach(([id, agentId]) => {
            if (agentId !== "IRCTC") { // Avoid duplicates
                options.push({ value: agentId, label: agentId });
            }
        });

        return options.sort((a, b) => {
            if (a.value === "all") return -1;
            if (b.value === "all") return 1;
            return a.label.localeCompare(b.label);
        });
    }, [agentMap]);

    // Role options
    const roleOptions = useMemo(() => [
        { value: "all", label: "All Roles" },
        { value: "1", label: "Admin (Role 1)" },
        { value: "2", label: "Booking Agent (Role 2)" },
        { value: "3", label: "Regular User (Role 3)" },
        { value: "Unknown", label: "Unknown Role" },
    ], []);

    // Helipad options
    const departureHelipadOptions = useMemo(() => {
        const options = [{ value: "all", label: "All Departure Helipads" }];
        const uniqueHelipads = new Set();

        allData.forEach((booking) => {
            const helipadId = booking.helicopterSchedule?.departure_helipad_id;
            const helipadName = booking.departureHelipadName;
            if (helipadId && helipadName && !uniqueHelipads.has(helipadId)) {
                uniqueHelipads.add(helipadId);
                options.push({
                    value: helipadId.toString(),
                    label: helipadName
                });
            }
        });

        return options.sort((a, b) => a.label.localeCompare(b.label));
    }, [allData]);

    const arrivalHelipadOptions = useMemo(() => {
        const options = [{ value: "all", label: "All Arrival Helipads" }];
        const uniqueHelipads = new Set();

        allData.forEach((booking) => {
            const helipadId = booking.helicopterSchedule?.arrival_helipad_id;
            const helipadName = booking.arrivalHelipadName;
            if (helipadId && helipadName && !uniqueHelipads.has(helipadId)) {
                uniqueHelipads.add(helipadId);
                options.push({
                    value: helipadId.toString(),
                    label: helipadName
                });
            }
        });

        return options.sort((a, b) => a.label.localeCompare(b.label));
    }, [allData]);

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            // Show default sort indicator for flight date when no custom sort is applied
            if (columnKey === 'bookDate' && !sortConfig.key) {
                return <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-blue-500')} />;
            }
            return <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-slate-400')} />;
        }
        return sortConfig.direction === 'asc' ?
            <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-blue-500', 'rotate-180')} /> :
            <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-blue-500')} />;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            "Confirmed": { bg: "bg-emerald-100", text: "text-emerald-800", icon: CheckCircleIcon },
            "Pending": { bg: "bg-yellow-100", text: "text-yellow-800", icon: ClockIcon },
            "Cancelled": { bg: "bg-red-100", text: "text-red-800", icon: XCircleIcon },
        };

        const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: ExclamationTriangleIcon };
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <IconComponent className={cn('w-3', 'h-3')} />
                {status || "N/A"}
            </span>
        );
    };

    const getPaymentBadge = (mode) => {
        const modeConfig = {
            "ADMIN": { bg: "bg-emerald-100", text: "text-emerald-800" },
            "DUMMY": { bg: "bg-yellow-100", text: "text-yellow-800" },
            "RAZORPAY": { bg: "bg-blue-100", text: "text-blue-800" },
        };

        const config = modeConfig[mode] || { bg: "bg-gray-100", text: "text-gray-800" };

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <CreditCardIcon className={cn('w-3', 'h-3')} />
                {mode || "N/A"}
            </span>
        );
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            "1": { bg: "bg-purple-100", text: "text-purple-800", label: "Admin" },
            "2": { bg: "bg-blue-100", text: "text-blue-800", label: "Booking Agent" },
            "3": { bg: "bg-green-100", text: "text-green-800", label: "Regular User" },
        };

        const config = roleConfig[role] || { bg: "bg-gray-100", text: "text-gray-800", label: "Unknown" };

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <UserGroupIcon className={cn('w-3', 'h-3')} />
                {config.label}
            </span>
        );
    };

    // Analytics calculations
    const analytics = useMemo(() => {
        const totalBookings = filteredData.length;
        const totalRevenue = filteredData.reduce((sum, booking) => sum + (parseFloat(booking.totalFare) || 0), 0);
        const confirmedBookings = filteredData.filter(b => b.bookingStatus === "Confirmed").length;
        const pendingBookings = filteredData.filter(b => b.bookingStatus === "Pending").length;
        const cancelledBookings = filteredData.filter(b => b.bookingStatus === "Cancelled").length;
        const totalPassengers = filteredData.reduce((sum, booking) => sum + (parseInt(booking.noOfPassengers) || 0), 0);

        const paymentModes = filteredData.reduce((acc, booking) => {
            const mode = booking.paymentMode || "Unknown";
            acc[mode] = (acc[mode] || 0) + 1;
            return acc;
        }, {});

        const agentStats = filteredData.reduce((acc, booking) => {
            const agent = booking.agentId || "FLYOLA";
            acc[agent] = (acc[agent] || 0) + 1;
            return acc;
        }, {});

        return {
            totalBookings,
            totalRevenue,
            confirmedBookings,
            pendingBookings,
            cancelledBookings,
            totalPassengers,
            paymentModes,
            agentStats,
            averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
            confirmationRate: totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0,
        };
    }, [filteredData]);
    return (
        <div className="space-y-8">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className={cn('flex', 'flex-col', 'lg:flex-row', 'lg:items-center', 'lg:justify-between', 'gap-4')}>
                <div>
                    <h1 className={cn('text-3xl', 'font-bold', 'text-slate-800', 'flex', 'items-center', 'gap-3')}>
                        <div className={cn('p-2', 'bg-gradient-to-r', 'from-red-500', 'to-orange-500', 'rounded-xl')}>
                            <CalendarDaysIcon className={cn('w-8', 'h-8', 'text-white')} />
                        </div>
                        🚁 Helicopter Booking Management
                    </h1>
                    <p className={cn('text-slate-600', 'mt-2')}>Monitor and manage all helicopter bookings with analytics</p>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')}>
                <div className={cn('bg-gradient-to-r', 'from-blue-500', 'to-blue-600', 'rounded-2xl', 'p-6', 'text-white')}>
                    <div className={cn('flex', 'items-center', 'justify-between')}>
                        <div>
                            <p className={cn('text-blue-100', 'text-sm', 'font-medium')}>Total Bookings</p>
                            <p className={cn('text-3xl', 'font-bold')}>{analytics.totalBookings.toLocaleString()}</p>
                        </div>
                        <ChartBarIcon className={cn('w-12', 'h-12', 'text-blue-200')} />
                    </div>
                </div>

                <div className={cn('bg-gradient-to-r', 'from-emerald-500', 'to-emerald-600', 'rounded-2xl', 'p-6', 'text-white')}>
                    <div className={cn('flex', 'items-center', 'justify-between')}>
                        <div>
                            <p className={cn('text-emerald-100', 'text-sm', 'font-medium')}>Total Revenue</p>
                            <p className={cn('text-3xl', 'font-bold')}>₹{analytics.totalRevenue.toLocaleString()}</p>
                        </div>
                        <BanknotesIcon className={cn('w-12', 'h-12', 'text-emerald-200')} />
                    </div>
                </div>

                <div className={cn('bg-gradient-to-r', 'from-purple-500', 'to-purple-600', 'rounded-2xl', 'p-6', 'text-white')}>
                    <div className={cn('flex', 'items-center', 'justify-between')}>
                        <div>
                            <p className={cn('text-purple-100', 'text-sm', 'font-medium')}>Total Passengers</p>
                            <p className={cn('text-3xl', 'font-bold')}>{analytics.totalPassengers.toLocaleString()}</p>
                        </div>
                        <UserGroupIcon className={cn('w-12', 'h-12', 'text-purple-200')} />
                    </div>
                </div>

                <div className={cn('bg-gradient-to-r', 'from-orange-500', 'to-orange-600', 'rounded-2xl', 'p-6', 'text-white')}>
                    <div className={cn('flex', 'items-center', 'justify-between')}>
                        <div>
                            <p className={cn('text-orange-100', 'text-sm', 'font-medium')}>Confirmation Rate</p>
                            <p className={cn('text-3xl', 'font-bold')}>{analytics.confirmationRate.toFixed(1)}%</p>
                        </div>
                        <CheckCircleIcon className={cn('w-12', 'h-12', 'text-orange-200')} />
                    </div>
                </div>
            </div>

            {/* Status Analytics */}
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-6')}>
                <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
                    <div className={cn('flex', 'items-center', 'gap-3', 'mb-4')}>
                        <CheckCircleIcon className={cn('w-6', 'h-6', 'text-emerald-600')} />
                        <h3 className={cn('text-lg', 'font-semibold', 'text-slate-800')}>Confirmed</h3>
                    </div>
                    <p className={cn('text-3xl', 'font-bold', 'text-emerald-600')}>{analytics.confirmedBookings}</p>
                    <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>
                        {analytics.totalBookings > 0 ? ((analytics.confirmedBookings / analytics.totalBookings) * 100).toFixed(1) : 0}% of total
                    </p>
                </div>

                <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
                    <div className={cn('flex', 'items-center', 'gap-3', 'mb-4')}>
                        <ClockIcon className={cn('w-6', 'h-6', 'text-yellow-600')} />
                        <h3 className={cn('text-lg', 'font-semibold', 'text-slate-800')}>Pending</h3>
                    </div>
                    <p className={cn('text-3xl', 'font-bold', 'text-yellow-600')}>{analytics.pendingBookings}</p>
                    <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>
                        {analytics.totalBookings > 0 ? ((analytics.pendingBookings / analytics.totalBookings) * 100).toFixed(1) : 0}% of total
                    </p>
                </div>

                <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
                    <div className={cn('flex', 'items-center', 'gap-3', 'mb-4')}>
                        <XCircleIcon className={cn('w-6', 'h-6', 'text-red-600')} />
                        <h3 className={cn('text-lg', 'font-semibold', 'text-slate-800')}>Cancelled</h3>
                    </div>
                    <p className={cn('text-3xl', 'font-bold', 'text-red-600')}>{analytics.cancelledBookings}</p>
                    <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>
                        {analytics.totalBookings > 0 ? ((analytics.cancelledBookings / analytics.totalBookings) * 100).toFixed(1) : 0}% of total
                    </p>
                </div>
            </div>

            {/* Status Filters */}
            <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
                <div className={cn('flex', 'flex-wrap', 'gap-3')}>
                    {["Confirmed", "Pending", "Cancelled", "All Booking"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => {
                                setStatus(filter);
                                setSearchTerm("");
                                setSelectedAgent("all");
                                setSelectedRole("all");
                                setSelectedDepartureAirport("all");
                                setSelectedArrivalAirport("all");
                                setCurrentPage(1);
                                setDownloadRange("page");
                                setBookingDateRange([null, null]);
                                setFlightDateRange([null, null]);
                            }}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${status === filter
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Filters */}
            <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <MagnifyingGlassIcon className={cn('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'w-5', 'h-5', 'text-slate-400')} />
                        <input
                            type="text"
                            onChange={(e) => debouncedSearch(e.target.value)}
                            placeholder="Search by ID, PNR, email, phone, passenger name, billing name, transaction ID, agent ID, helicopter, helipads..."
                            className={cn('w-full', 'pl-10', 'pr-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all')}
                        />
                    </div>

                    {/* Filter Row 1: Agent, Role, Airports */}
                    <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-4')}>
                        <select
                            value={selectedAgent}
                            onChange={(e) => {
                                setSelectedAgent(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all')}
                        >
                            {agentOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all')}
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedDepartureHelipad}
                            onChange={(e) => {
                                setSelectedDepartureHelipad(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all')}
                        >
                            {departureHelipadOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedArrivalHelipad}
                            onChange={(e) => {
                                setSelectedArrivalHelipad(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all')}
                        >
                            {arrivalHelipadOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Filters */}
                    <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-6', 'pt-4', 'border-t', 'border-slate-200')}>
                        {/* Booking Date Filter */}
                        <div className="space-y-2">
                            <label className={cn('text-sm', 'font-medium', 'text-slate-700', 'flex', 'items-center', 'gap-2')}>
                                <CalendarDaysIcon className={cn('w-4', 'h-4', 'text-blue-600')} />
                                Filter by Booking Date
                            </label>
                            <div className={cn('flex', 'gap-2')}>
                                <DatePicker
                                    selected={startBookingDate}
                                    onChange={(date) => {
                                        setBookingDateRange([date, endBookingDate]);
                                        setCurrentPage(1);
                                    }}
                                    selectsStart
                                    startDate={startBookingDate}
                                    endDate={endBookingDate}
                                    maxDate={new Date()}
                                    placeholderText="Start Booking Date"
                                    className={cn('flex-1', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all')}
                                />
                                <DatePicker
                                    selected={endBookingDate}
                                    onChange={(date) => {
                                        setBookingDateRange([startBookingDate, date]);
                                        setCurrentPage(1);
                                    }}
                                    selectsEnd
                                    startDate={startBookingDate}
                                    endDate={endBookingDate}
                                    minDate={startBookingDate}
                                    maxDate={new Date()}
                                    placeholderText="End Booking Date"
                                    className={cn('flex-1', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all')}
                                />
                                {(startBookingDate || endBookingDate) && (
                                    <button
                                        onClick={() => {
                                            setBookingDateRange([null, null]);
                                            setCurrentPage(1);
                                        }}
                                        className={cn('px-3', 'py-3', 'text-red-600', 'hover:bg-red-50', 'rounded-xl', 'transition-colors')}
                                        title="Clear booking date filter"
                                    >
                                        <XCircleIcon className={cn('w-5', 'h-5')} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Flight Date Filter */}
                        <div className="space-y-2">
                            <label className={cn('text-sm', 'font-medium', 'text-slate-700', 'flex', 'items-center', 'gap-2')}>
                                <CalendarDaysIcon className={cn('w-4', 'h-4', 'text-orange-600')} />
                                Filter by Flight Date
                            </label>
                            <div className={cn('flex', 'gap-2')}>
                                <DatePicker
                                    selected={startFlightDate}
                                    onChange={(date) => {
                                        setFlightDateRange([date, endFlightDate]);
                                        setCurrentPage(1);
                                    }}
                                    selectsStart
                                    startDate={startFlightDate}
                                    endDate={endFlightDate}
                                    placeholderText="Start Flight Date"
                                    className={cn('flex-1', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-orange-500', 'focus:border-transparent', 'transition-all')}
                                />
                                <DatePicker
                                    selected={endFlightDate}
                                    onChange={(date) => {
                                        setFlightDateRange([startFlightDate, date]);
                                        setCurrentPage(1);
                                    }}
                                    selectsEnd
                                    startDate={startFlightDate}
                                    endDate={endFlightDate}
                                    minDate={startFlightDate}
                                    placeholderText="End Flight Date"
                                    className={cn('flex-1', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-orange-500', 'focus:border-transparent', 'transition-all')}
                                />
                                {(startFlightDate || endFlightDate) && (
                                    <button
                                        onClick={() => {
                                            setFlightDateRange([null, null]);
                                            setCurrentPage(1);
                                        }}
                                        className={cn('px-3', 'py-3', 'text-red-600', 'hover:bg-red-50', 'rounded-xl', 'transition-colors')}
                                        title="Clear flight date filter"
                                    >
                                        <XCircleIcon className={cn('w-5', 'h-5')} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Clear All Filters Button */}
                    {(searchTerm || selectedAgent !== "all" || selectedRole !== "all" ||
                        selectedDepartureHelipad !== "all" || selectedArrivalHelipad !== "all" ||
                        startBookingDate || endBookingDate || startFlightDate || endFlightDate) && (
                            <div className={cn('flex', 'justify-center', 'pt-4', 'border-t', 'border-slate-200')}>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedAgent("all");
                                        setSelectedRole("all");
                                        setSelectedDepartureHelipad("all");
                                        setSelectedArrivalHelipad("all");
                                        setBookingDateRange([null, null]);
                                        setFlightDateRange([null, null]);
                                        setCurrentPage(1);
                                        // Clear the search input
                                        const searchInput = document.querySelector('input[type="text"]');
                                        if (searchInput) searchInput.value = '';
                                    }}
                                    className={cn('flex', 'items-center', 'gap-2', 'px-6', 'py-2', 'bg-slate-100', 'text-slate-700', 'rounded-xl', 'hover:bg-slate-200', 'transition-colors', 'font-medium')}
                                >
                                    <XCircleIcon className={cn('w-4', 'h-4')} />
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                </div>
            </div>

            {/* Export and Summary */}
            <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
                <div className={cn('flex', 'flex-col', 'lg:flex-row', 'items-center', 'justify-between', 'gap-4')}>
                    <div className={cn('flex', 'flex-col', 'sm:flex-row', 'items-center', 'gap-4')}>
                        <select
                            value={downloadRange}
                            onChange={(e) => {
                                setDownloadRange(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all')}
                        >
                            {downloadOptions.filter(option => option.value !== "custom").map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <div className={cn('text-sm', 'text-slate-600', 'bg-slate-50', 'px-4', 'py-3', 'rounded-xl')}>
                            <span className="font-medium">Active Filters:</span>
                            {selectedAgent !== "all" && <span className={cn('ml-2', 'bg-blue-100', 'text-blue-800', 'px-2', 'py-1', 'rounded-md', 'text-xs')}>Agent: {selectedAgent}</span>}
                            {selectedRole !== "all" && <span className={cn('ml-2', 'bg-purple-100', 'text-purple-800', 'px-2', 'py-1', 'rounded-md', 'text-xs')}>Role: {roleOptions.find(r => r.value === selectedRole)?.label}</span>}
                            {selectedDepartureHelipad !== "all" && <span className={cn('ml-2', 'bg-green-100', 'text-green-800', 'px-2', 'py-1', 'rounded-md', 'text-xs')}>From: {departureHelipadOptions.find(a => a.value === selectedDepartureHelipad)?.label}</span>}
                            {selectedArrivalHelipad !== "all" && <span className={cn('ml-2', 'bg-orange-100', 'text-orange-800', 'px-2', 'py-1', 'rounded-md', 'text-xs')}>To: {arrivalHelipadOptions.find(a => a.value === selectedArrivalHelipad)?.label}</span>}
                            {(startBookingDate || endBookingDate) && <span className={cn('ml-2', 'bg-blue-100', 'text-blue-800', 'px-2', 'py-1', 'rounded-md', 'text-xs')}>Booking Date: {startBookingDate ? startBookingDate.toLocaleDateString() : 'Any'} - {endBookingDate ? endBookingDate.toLocaleDateString() : 'Any'}</span>}
                            {(startFlightDate || endFlightDate) && <span className={cn('ml-2', 'bg-orange-100', 'text-orange-800', 'px-2', 'py-1', 'rounded-md', 'text-xs')}>Flight Date: {startFlightDate ? startFlightDate.toLocaleDateString() : 'Any'} - {endFlightDate ? endFlightDate.toLocaleDateString() : 'Any'}</span>}
                            {selectedAgent === "all" && selectedRole === "all" && selectedDepartureHelipad === "all" && selectedArrivalHelipad === "all" && !startBookingDate && !endBookingDate && !startFlightDate && !endFlightDate && !searchTerm && <span className={cn('ml-2', 'text-slate-500')}>None</span>}
                        </div>
                    </div>

                    <div className={cn('flex', 'items-center', 'gap-4')}>
                        <button
                            onClick={exportToExcel}
                            className={cn('flex', 'items-center', 'gap-2', 'px-6', 'py-3', 'bg-gradient-to-r', 'from-emerald-500', 'to-teal-500', 'text-white', 'rounded-xl', 'hover:from-emerald-600', 'hover:to-teal-600', 'transition-all', 'duration-200', 'shadow-lg', 'font-semibold')}
                        >
                            <ArrowDownTrayIcon className={cn('w-5', 'h-5')} />
                            Download Excel
                        </button>

                        <span className={cn('text-sm', 'text-slate-600')}>
                            Showing {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–
                            {Math.min(currentPage * BOOKINGS_PER_PAGE, filteredData.length)} of {filteredData.length} records
                        </span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className={cn('flex', 'items-center', 'gap-3', 'p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-xl', 'text-red-700')}>
                    <ExclamationTriangleIcon className={cn('w-5', 'h-5', 'flex-shrink-0')} />
                    {error}
                </div>
            )}      {/* B
ookings Table */}
            <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'overflow-hidden')}>
                <div className={cn('bg-gradient-to-r', 'from-slate-50', 'to-red-50', 'px-6', 'py-4', 'border-b', 'border-slate-200')}>
                    <div className={cn('flex', 'items-center', 'justify-between')}>
                        <h3 className={cn('text-xl', 'font-semibold', 'text-slate-800', 'flex', 'items-center', 'gap-2')}>
                            <CalendarDaysIcon className={cn('w-6', 'h-6', 'text-red-600')} />
                            🚁 Helicopter Booking Records ({filteredData.length})
                        </h3>
                        <p className={cn('text-sm', 'text-slate-500')}>
                            Sorted by latest flight date, then latest booking date
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={cn('bg-slate-50', 'border-b', 'border-slate-200')}>
                            <tr>
                                {[
                                    { key: 'bookingNo', label: 'Booking ID', sortable: true, width: 'min-w-[120px]' },
                                    { key: 'pnr', label: 'PNR', sortable: true, width: 'min-w-[100px]' },
                                    { key: 'bookDate', label: 'Flight Date', sortable: true, width: 'min-w-[120px]' },
                                    { key: 'created_at', label: 'Booking Date', sortable: true, width: 'min-w-[160px]' },
                                    { key: 'email_id', label: 'Email', sortable: false, width: 'min-w-[200px]' },
                                    { key: 'contact_no', label: 'Phone', sortable: false, width: 'min-w-[120px]' },
                                    { key: 'noOfPassengers', label: 'Passengers', sortable: true, width: 'min-w-[100px]' },
                                    { key: 'passengers', label: 'Names', sortable: false, width: 'min-w-[320px]' },
                                    { key: 'billingName', label: 'Billing Name', sortable: false, width: 'min-w-[200px]' },
                                    { key: 'booked_seat', label: 'Seats', sortable: false, width: 'min-w-[120px]' },
                                    { key: 'totalFare', label: 'Price', sortable: true, width: 'min-w-[100px]' },
                                    { key: 'bookingStatus', label: 'Status', sortable: true, width: 'min-w-[120px]' },
                                    { key: 'paymentMode', label: 'Payment', sortable: true, width: 'min-w-[120px]' },
                                    { key: 'transactionId', label: 'Transaction ID', sortable: false, width: 'min-w-[140px]' },
                                    { key: 'paymentId', label: 'Payment ID', sortable: false, width: 'min-w-[140px]' },
                                    { key: 'agentId', label: 'Agent ID', sortable: true, width: 'min-w-[120px]' },
                                    { key: 'userRole', label: 'User Role', sortable: true, width: 'min-w-[120px]' },
                                    { key: 'helicopterNumber', label: 'Helicopter', sortable: true, width: 'min-w-[120px]' },
                                    { key: 'departure_time', label: 'Dep Time', sortable: false, width: 'min-w-[120px]' },
                                    { key: 'arrival_time', label: 'Arr Time', sortable: false, width: 'min-w-[120px]' },
                                    { key: 'departureHelipadName', label: 'From', sortable: false, width: 'min-w-[160px]' },
                                    { key: 'arrivalHelipadName', label: 'To', sortable: false, width: 'min-w-[160px]' },
                                    { key: 'actions', label: 'Actions', sortable: false, width: 'min-w-[160px]' },
                                ].map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${column.width} ${column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                                            }`}
                                        onClick={column.sortable ? () => handleSort(column.key) : undefined}
                                    >
                                        <div className={cn('flex', 'items-center', 'gap-2')}>
                                            {column.label}
                                            {column.sortable && getSortIcon(column.key)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={cn('divide-y', 'divide-slate-200')}>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={23} className={cn('px-6', 'py-12', 'text-center')}>
                                        <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
                                            <div className={cn('w-8', 'h-8', 'border-4', 'border-blue-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
                                            <span className="text-slate-500">Loading bookings...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentData.length ? (
                                currentData.map((booking) => (
                                    <tr key={booking.id} className={cn('hover:bg-slate-50', 'transition-colors')}>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'font-semibold', 'text-slate-900')}>
                                            {booking.bookingNo || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.pnr || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.bookDate ? new Date(booking.bookDate).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.created_at ? new Date(booking.created_at).toLocaleString() : "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.email_id || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.contact_no || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.noOfPassengers || "0"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'w-80')}>
                                            <div className={cn('max-w-[320px]', 'truncate', 'text-slate-700')} title={booking.passengers?.map((p) => p.name).join(", ") || "N/A"}>
                                                {booking.passengers?.map((p) => p.name).join(", ") || "N/A"}
                                            </div>
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.billingName || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.booked_seat || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'font-semibold', 'text-slate-900')}>
                                            {booking.totalFare ? `₹${parseFloat(booking.totalFare).toFixed(2)}` : "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap')}>
                                            {getStatusBadge(booking.bookingStatus)}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap')}>
                                            {getPaymentBadge(booking.paymentMode)}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.transactionId || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.paymentId || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.agentId}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap')}>
                                            {getRoleBadge(booking.userRole)}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700', 'font-semibold')}>
                                            🚁 {booking.helicopterNumber || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.helicopterSchedule?.departure_time || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.helicopterSchedule?.arrival_time || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.departureHelipadName || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap', 'text-slate-700')}>
                                            {booking.arrivalHelipadName || "N/A"}
                                        </td>
                                        <td className={cn('px-4', 'py-2', 'whitespace-nowrap')}>
                                            <div className={cn('flex', 'items-center', 'gap-2')}>
                                                <button
                                                    onClick={() => handleViewBooking(booking)}
                                                    className={cn('flex', 'items-center', 'gap-1', 'px-3', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'text-sm', 'font-medium')}
                                                >
                                                    <EyeIcon className={cn('w-4', 'h-4')} />
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={23} className={cn('px-6', 'py-12', 'text-center')}>
                                        <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
                                            <CalendarDaysIcon className={cn('w-12', 'h-12', 'text-slate-300')} />
                                            <div>
                                                <p className={cn('text-slate-500', 'font-medium')}>No bookings found</p>
                                                <p className={cn('text-slate-400', 'text-sm')}>
                                                    {searchTerm ? "Try adjusting your search terms" : "No bookings match your current filters"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={cn('flex', 'justify-center', 'items-center', 'gap-2', 'p-6', 'border-t', 'border-slate-200')}>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || isLoading}
                            className={cn('px-4', 'py-2', 'rounded-lg', 'bg-slate-100', 'text-slate-700', 'hover:bg-slate-200', 'disabled:opacity-50', 'transition-colors')}
                        >
                            Previous
                        </button>

                        <div className={cn('flex', 'items-center', 'gap-1')}>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        disabled={isLoading}
                                        className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            } disabled:opacity-50`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || isLoading}
                            className={cn('px-4', 'py-2', 'rounded-lg', 'bg-slate-100', 'text-slate-700', 'hover:bg-slate-200', 'disabled:opacity-50', 'transition-colors')}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Booking Details Modal */}
            <BookingDetailsModal
                booking={selectedBooking}
                isOpen={showBookingModal}
                onClose={() => {
                    setShowBookingModal(false);
                    setSelectedBooking(null);
                }}
            />
        </div>
    );
}

