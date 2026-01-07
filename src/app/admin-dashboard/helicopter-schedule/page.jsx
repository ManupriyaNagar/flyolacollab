"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import {
    ArrowsUpDownIcon,
    CalendarDaysIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Authentication helper function
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Enhanced fetch with authentication
const authenticatedFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: 'include',
  });
};

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function HelicopterSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [helicopters, setHelicopters] = useState([]);
  const [helipads, setHelipads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('All Days');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    helicopter_id: '',
    departure_helipad_id: '',
    arrival_helipad_id: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    status: 1,
    via_stop_id: '[]',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch schedules, helicopters, and helipads in parallel
      const [schedulesRes, helicoptersRes, helipadsRes] = await Promise.all([
        authenticatedFetch(`${BASE_URL}/helicopter-schedules`),
        authenticatedFetch(`${BASE_URL}/helicopters`),
        authenticatedFetch(`${BASE_URL}/helipads`)
      ]);

      if (schedulesRes.ok) {
        const schedulesData = await schedulesRes.json();
        setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
      }

      if (helicoptersRes.ok) {
        const helicoptersData = await helicoptersRes.json();
        setHelicopters(Array.isArray(helicoptersData) ? helicoptersData : []);
      }

      if (helipadsRes.ok) {
        const helipadsData = await helipadsRes.json();
        setHelipads(Array.isArray(helipadsData) ? helipadsData : []);
      }
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingSchedule 
        ? `${BASE_URL}/helicopter-schedules/${editingSchedule.id}`
        : `${BASE_URL}/helicopter-schedules`;
      
      const method = editingSchedule ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingSchedule ? 'Schedule updated successfully!' : 'Schedule created successfully!');
        fetchData();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save schedule');
      }
    } catch (err) {
      toast.error('Failed to save schedule');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/helicopter-schedules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Schedule deleted successfully!');
        fetchData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete schedule');
      }
    } catch (err) {
      toast.error('Failed to delete schedule');
    }
    setShowDeleteConfirm(null);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    
    // Ensure via_stop_id is valid JSON
    let viaStopId = '[]';
    if (schedule.via_stop_id) {
      try {
        JSON.parse(schedule.via_stop_id);
        viaStopId = schedule.via_stop_id;
      } catch (e) {
        viaStopId = '[]';
      }
    }
    
    setFormData({
      helicopter_id: schedule.helicopter_id || '',
      departure_helipad_id: schedule.departure_helipad_id || '',
      arrival_helipad_id: schedule.arrival_helipad_id || '',
      departure_time: schedule.departure_time || '',
      arrival_time: schedule.arrival_time || '',
      price: schedule.price || '',
      status: parseInt(schedule.status) || 1,
      via_stop_id: viaStopId,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setFormData({
      helicopter_id: '',
      departure_helipad_id: '',
      arrival_helipad_id: '',
      departure_time: '',
      arrival_time: '',
      price: '',
      status: 1,
      via_stop_id: '[]',
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getHelicopterName = (helicopterId) => {
    const helicopter = helicopters.find(h => h.id === helicopterId);
    return helicopter ? helicopter.helicopter_number : 'Unknown';
  };

  const getHelicopterDepartureDay = (helicopterId) => {
    const helicopter = helicopters.find(h => h.id === helicopterId);
    return helicopter?.departure_day || 'N/A';
  };

  const getHelipadName = (helipadId) => {
    const helipad = helipads.find(h => h.id === helipadId);
    return helipad ? `${helipad.helipad_name} (${helipad.helipad_code})` : 'Unknown';
  };

  const filteredSchedules = useMemo(() => {
    let filtered = schedules.filter((schedule) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const helicopterName = getHelicopterName(schedule.helicopter_id).toLowerCase();
      const departureHelipad = getHelipadName(schedule.departure_helipad_id).toLowerCase();
      const arrivalHelipad = getHelipadName(schedule.arrival_helipad_id).toLowerCase();
      
      const matchesSearch = (
        helicopterName.includes(searchLower) ||
        departureHelipad.includes(searchLower) ||
        arrivalHelipad.includes(searchLower) ||
        schedule.departure_time?.includes(searchLower) ||
        schedule.arrival_time?.includes(searchLower)
      );

      // Day filter - based on helicopter's departure day
      const helicopterDay = getHelicopterDepartureDay(schedule.helicopter_id);
      const matchesDay = filterDay === 'All Days' || helicopterDay === filterDay;

      // Status filter
      const scheduleStatus = schedule.status === 1 ? 'Active' : 'Inactive';
      const matchesStatus = filterStatus === 'All' || scheduleStatus === filterStatus;

      return matchesSearch && matchesDay && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [schedules, searchTerm, filterDay, filterStatus, sortConfig, helicopters, helipads]);

  // Pagination
  const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage) || 1;
  const paginatedSchedules = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSchedules.slice(start, start + entriesPerPage);
  }, [filteredSchedules, currentPage, entriesPerPage]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-slate-400')} />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-green-500', 'rotate-180')} /> :
      <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-green-500')} />;
  };

  const getStatusColor = (status) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className={cn('flex', 'flex-col', 'lg:flex-row', 'lg:items-center', 'lg:justify-between', 'gap-4')}>
        <div>
          <h1 className={cn('text-3xl', 'font-bold', 'text-slate-800', 'flex', 'items-center', 'gap-3')}>
            <div className={cn('p-2', 'bg-gradient-to-r', 'from-green-500', 'to-emerald-500', 'rounded-xl')}>
              <CalendarDaysIcon className={cn('w-8', 'h-8', 'text-white')} />
            </div>
            Helicopter Schedule
          </h1>
          <p className={cn('text-slate-600', 'mt-2')}>Manage helicopter flight schedules and routes</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className={cn('flex', 'items-center', 'gap-2', 'px-6', 'py-3', 'bg-gradient-to-r', 'from-green-500', 'to-emerald-500', 'text-white', 'rounded-xl', 'hover:from-green-600', 'hover:to-emerald-600', 'transition-all', 'duration-200', 'shadow-lg', 'font-medium')}
        >
          <PlusIcon className={cn('w-5', 'h-5')} />
          Add New Schedule
        </button>
      </div>

      {/* Search and Filters */}
      <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
        <div className={cn('flex', 'flex-col', 'lg:flex-row', 'lg:items-center', 'lg:justify-between', 'gap-4')}>
          <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'flex-1')}>
            <div className={cn('relative', 'flex-1', 'max-w-md')}>
              <MagnifyingGlassIcon className={cn('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'w-5', 'h-5', 'text-slate-400')} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={cn('w-full', 'pl-10', 'pr-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent', 'transition-all')}
                placeholder="Search by helicopter, helipad, or time..."
              />
            </div>
            
            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4')}>
              <div className={cn('flex', 'items-center', 'gap-2')}>
                <FunnelIcon className={cn('w-5', 'h-5', 'text-slate-400')} />
                <select
                  value={filterDay}
                  onChange={(e) => {
                    setFilterDay(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
                >
                  <option>All Days</option>
                  {WEEK_DAYS.map((day) => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          
          <div className={cn('flex', 'items-center', 'gap-3')}>
            <span className={cn('text-sm', 'text-slate-600')}>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={cn('px-3', 'py-2', 'border', 'border-slate-300', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent')}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className={cn('text-sm', 'text-slate-600')}>entries</span>
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'overflow-hidden')}>
        <div className={cn('bg-gradient-to-r', 'from-green-50', 'to-emerald-50', 'px-6', 'py-4', 'border-b', 'border-slate-200')}>
          <h3 className={cn('text-xl', 'font-semibold', 'text-slate-800', 'flex', 'items-center', 'gap-2')}>
            <CalendarDaysIcon className={cn('w-6', 'h-6', 'text-green-600')} />
            Helicopter Schedules ({filteredSchedules.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className={cn('w-full', 'min-w-max')}>
            <thead className={cn('bg-slate-50', 'border-b', 'border-slate-200')}>
              <tr>
                {[
                  { key: 'helicopter_id', label: 'HELICOPTER', sortable: false },
                  { key: 'day', label: 'DAY', sortable: false },
                  { key: 'route', label: 'ROUTE', sortable: false },
                  { key: 'departure_time', label: 'DEPARTURE', sortable: true },
                  { key: 'arrival_time', label: 'ARRIVAL', sortable: true },
                  { key: 'price', label: 'PRICE', sortable: true },
                  { key: 'status', label: 'STATUS', sortable: true },
                  { key: 'actions', label: 'ACTIONS', sortable: false },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
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
            <tbody className={cn('divide-y', 'divide-slate-100', 'bg-white')}>
              {loading ? (
                <tr>
                  <td colSpan={8} className={cn('px-6', 'py-12', 'text-center')}>
                    <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
                      <div className={cn('w-8', 'h-8', 'border-4', 'border-green-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
                      <span className="text-slate-500">Loading schedules...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={8} className={cn('px-6', 'py-12', 'text-center')}>
                    <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
                      <CalendarDaysIcon className={cn('w-12', 'h-12', 'text-slate-300')} />
                      <div>
                        <p className={cn('text-slate-500', 'font-medium')}>No schedules found</p>
                        <p className={cn('text-slate-400', 'text-sm')}>
                          {searchTerm || filterDay !== 'All Days' || filterStatus !== 'All' 
                            ? "Try adjusting your filters or search terms" 
                            : "Add your first helicopter schedule to get started"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSchedules.map((schedule) => (
                  <tr key={schedule.id} className={cn('hover:bg-slate-50/50', 'transition-colors')}>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <div className={cn('font-medium', 'text-slate-900', 'text-sm')}>
                        {getHelicopterName(schedule.helicopter_id)}
                      </div>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <span className={cn('inline-flex', 'items-center', 'px-2.5', 'py-1', 'rounded-full', 'text-xs', 'font-medium', 'bg-blue-100', 'text-blue-800')}>
                        {getHelicopterDepartureDay(schedule.helicopter_id)}
                      </span>
                    </td>
                    <td className={cn('px-4', 'py-3')}>
                      <div className={cn('flex', 'items-center', 'gap-1.5', 'text-xs', 'min-w-[250px]')}>
                        <MapPinIcon className={cn('w-3', 'h-3', 'text-green-500', 'flex-shrink-0')} />
                        <span className={cn('text-slate-700', 'truncate')} title={getHelipadName(schedule.departure_helipad_id)}>
                          {getHelipadName(schedule.departure_helipad_id)}
                        </span>
                        <span className={cn('text-slate-400', 'mx-1')}>→</span>
                        <MapPinIcon className={cn('w-3', 'h-3', 'text-red-500', 'flex-shrink-0')} />
                        <span className={cn('text-slate-700', 'truncate')} title={getHelipadName(schedule.arrival_helipad_id)}>
                          {getHelipadName(schedule.arrival_helipad_id)}
                        </span>
                      </div>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <div className={cn('flex', 'items-center', 'gap-1.5')}>
                        <ClockIcon className={cn('w-3.5', 'h-3.5', 'text-slate-400')} />
                        <span className={cn('text-slate-700', 'text-sm')}>{schedule.departure_time}</span>
                      </div>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <div className={cn('flex', 'items-center', 'gap-1.5')}>
                        <ClockIcon className={cn('w-3.5', 'h-3.5', 'text-slate-400')} />
                        <span className={cn('text-slate-700', 'text-sm')}>{schedule.arrival_time || 'Not set'}</span>
                      </div>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <div className={cn('flex', 'items-center', 'gap-1')}>
                        <CurrencyDollarIcon className={cn('w-3.5', 'h-3.5', 'text-slate-400')} />
                        <span className={cn('font-semibold', 'text-slate-900', 'text-sm')}>
                          ₹{schedule.price ? Number(schedule.price).toLocaleString() : '0'}
                        </span>
                      </div>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                        {getStatusText(schedule.status)}
                      </span>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <div className={cn('flex', 'items-center', 'gap-1.5')}>
                        <button
                          onClick={() => handleEdit(schedule)}
                          className={cn('p-1.5', 'text-blue-600', 'hover:bg-blue-50', 'rounded-lg', 'transition-colors')}
                          title="Edit schedule"
                        >
                          <PencilIcon className={cn('w-4', 'h-4')} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(schedule)}
                          className={cn('p-1.5', 'text-red-600', 'hover:bg-red-50', 'rounded-lg', 'transition-colors')}
                          title="Delete schedule"
                        >
                          <TrashIcon className={cn('w-4', 'h-4')} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredSchedules.length > 0 && (
          <div className={cn('px-6', 'py-4', 'border-t', 'border-slate-200', 'bg-slate-50')}>
            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'items-center', 'justify-between', 'gap-4')}>
              <div className={cn('text-sm', 'text-slate-600')}>
                Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, filteredSchedules.length)} of {filteredSchedules.length} entries
              </div>
              
              <div className={cn('flex', 'items-center', 'gap-2')}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={cn('px-3', 'py-2', 'border', 'border-slate-300', 'rounded-lg', 'text-sm', 'font-medium', 'text-slate-700', 'hover:bg-white', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'transition-colors')}
                >
                  Previous
                </button>
                
                <div className={cn('flex', 'items-center', 'gap-1')}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-green-500 text-white'
                              : 'border border-slate-300 text-slate-700 hover:bg-white'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className={cn('px-2', 'text-slate-400')}>...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={cn('px-3', 'py-2', 'border', 'border-slate-300', 'rounded-lg', 'text-sm', 'font-medium', 'text-slate-700', 'hover:bg-white', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'transition-colors')}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Transition show={showModal} as={React.Fragment}>
        <Dialog as="div" className={cn('relative', 'z-50')} onClose={handleCloseModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={cn('fixed', 'inset-0', 'bg-black/25', 'backdrop-blur-sm')} />
          </Transition.Child>

          <div className={cn('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'p-4')}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={cn('w-full', 'max-w-4xl', 'bg-white', 'rounded-2xl', 'shadow-2xl', 'max-h-[90vh]', 'overflow-y-auto')}>
                <div className={cn('flex', 'items-center', 'justify-between', 'p-6', 'border-b', 'border-slate-200')}>
                  <Dialog.Title className={cn('text-xl', 'font-semibold', 'text-slate-800')}>
                    {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                  </Dialog.Title>
                  <button
                    onClick={handleCloseModal}
                    className={cn('p-2', 'hover:bg-slate-100', 'rounded-lg', 'transition-colors')}
                  >
                    <XMarkIcon className={cn('w-5', 'h-5', 'text-slate-500')} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className={cn('p-6', 'space-y-6')}>
                  <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Helicopter *
                      </label>
                      <select
                        required
                        value={formData.helicopter_id}
                        onChange={(e) => setFormData({ ...formData, helicopter_id: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent')}
                      >
                        <option value="">Select a helicopter</option>
                        {helicopters.map((helicopter) => (
                          <option key={helicopter.id} value={helicopter.id}>
                            {helicopter.helicopter_number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Price (INR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent')}
                        placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Departure Helipad *
                      </label>
                      <select
                        required
                        value={formData.departure_helipad_id}
                        onChange={(e) => setFormData({ ...formData, departure_helipad_id: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent')}
                      >
                        <option value="">Select Helipad</option>
                        {helipads.map((helipad) => (
                          <option key={helipad.id} value={helipad.id}>
                            {helipad.helipad_name} ({helipad.helipad_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Arrival Helipad *
                      </label>
                      <select
                        required
                        value={formData.arrival_helipad_id}
                        onChange={(e) => setFormData({ ...formData, arrival_helipad_id: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent')}
                      >
                        <option value="">Select Helipad</option>
                        {helipads.map((helipad) => (
                          <option key={helipad.id} value={helipad.id}>
                            {helipad.helipad_name} ({helipad.helipad_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Departure Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.departure_time}
                        onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent')}
                      />
                    </div>

                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Arrival Time
                      </label>
                      <input
                        type="time"
                        value={formData.arrival_time}
                        onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                      Stop Helipads (Optional)
                    </label>
                    <div className={cn('grid', 'grid-cols-2', 'md:grid-cols-3', 'gap-2', 'max-h-40', 'overflow-y-auto', 'border', 'border-slate-300', 'rounded-xl', 'p-4')}>
                      {helipads.map((helipad) => {
                        let currentStops = [];
                        try {
                          const parsed = JSON.parse(formData.via_stop_id || '[]');
                          currentStops = Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                          currentStops = [];
                        }
                        const isSelected = currentStops.includes(helipad.id);
                        
                        return (
                          <label key={helipad.id} className={cn('flex', 'items-center', 'space-x-2', 'cursor-pointer')}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                try {
                                  let newStops = [...currentStops];
                                  if (e.target.checked) {
                                    newStops.push(helipad.id);
                                  } else {
                                    newStops = newStops.filter(id => id !== helipad.id);
                                  }
                                  setFormData({ ...formData, via_stop_id: JSON.stringify(newStops) });
                                } catch (error) {
                                  setFormData({ ...formData, via_stop_id: '[]' });
                                }
                              }}
                              className={cn('rounded', 'border-slate-300', 'text-green-600', 'focus:ring-green-500')}
                            />
                            <span className={cn('text-sm', 'text-slate-700')}>
                              {helipad.helipad_name} ({helipad.helipad_code})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Status
                      </label>
                      <select
                        value={String(formData.status)}
                        onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-500', 'focus:border-transparent')}
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className={cn('px-6', 'py-3', 'border', 'border-slate-300', 'text-slate-700', 'rounded-xl', 'hover:bg-slate-50', 'transition-colors')}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={cn('px-6', 'py-3', 'bg-gradient-to-r', 'from-green-500', 'to-emerald-500', 'text-white', 'rounded-xl', 'hover:from-green-600', 'hover:to-emerald-600', 'transition-all', 'duration-200', 'shadow-lg')}
                    >
                      {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition show={!!showDeleteConfirm} as={React.Fragment}>
        <Dialog as="div" className={cn('relative', 'z-50')} onClose={() => setShowDeleteConfirm(null)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={cn('fixed', 'inset-0', 'bg-black/25', 'backdrop-blur-sm')} />
          </Transition.Child>

          <div className={cn('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'p-4')}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={cn('w-full', 'max-w-md', 'bg-white', 'rounded-2xl', 'shadow-2xl')}>
                <div className="p-6">
                  <div className={cn('flex', 'items-center', 'gap-4', 'mb-4')}>
                    <div className={cn('w-12', 'h-12', 'bg-red-100', 'rounded-full', 'flex', 'items-center', 'justify-center')}>
                      <ExclamationTriangleIcon className={cn('w-6', 'h-6', 'text-red-600')} />
                    </div>
                    <div>
                      <Dialog.Title className={cn('text-lg', 'font-semibold', 'text-slate-800')}>
                        Delete Schedule
                      </Dialog.Title>
                      <p className={cn('text-sm', 'text-slate-600')}>
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  
                  <p className={cn('text-slate-700', 'mb-6')}>
                    Are you sure you want to delete this helicopter schedule? 
                    This will permanently remove the schedule and all associated data.
                  </p>
                  
                  <div className={cn('flex', 'justify-end', 'gap-3')}>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className={cn('px-4', 'py-2', 'border', 'border-slate-300', 'text-slate-700', 'rounded-lg', 'hover:bg-slate-50', 'transition-colors')}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(showDeleteConfirm.id)}
                      className={cn('px-4', 'py-2', 'bg-red-600', 'text-white', 'rounded-lg', 'hover:bg-red-700', 'transition-colors')}
                    >
                      Delete Schedule
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}