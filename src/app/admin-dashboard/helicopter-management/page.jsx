"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowsUpDownIcon,
  CogIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function HelicopterManagementPage() {
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
  const [editingHelicopter, setEditingHelicopter] = useState(null);
  const [formData, setFormData] = useState({
    helicopter_number: '',
    departure_day: 'Monday',
    start_helipad_id: '',
    end_helipad_id: '',
    helipad_stop_ids: '[]',
    seat_limit: 6,
    status: 1,
  });

  useEffect(() => {
    fetchHelicopters();
  }, []);

  const fetchHelicopters = async () => {
    setLoading(true);
    try {
      // Fetch helicopters and helipads
      const [helicoptersRes, helipadsRes] = await Promise.all([
        fetch(`${BASE_URL}/helicopters`),
        fetch(`${BASE_URL}/helipads`)
      ]);

      if (helicoptersRes.ok) {
        const helicoptersData = await helicoptersRes.json();
        setHelicopters(Array.isArray(helicoptersData) ? helicoptersData : []);
      } else {
        setHelicopters([]);
      }

      if (helipadsRes.ok) {
        const helipadsData = await helipadsRes.json();
        setHelipads(Array.isArray(helipadsData) ? helipadsData : []);
      } else {
        setHelipads([]);
      }
    } catch (err) {
      toast.error('Failed to fetch data');
      setHelicopters([]);
      setHelipads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingHelicopter 
        ? `${BASE_URL}/helicopters/${editingHelicopter.id}`
        : `${BASE_URL}/helicopters`;
      
      const method = editingHelicopter ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingHelicopter ? 'Helicopter updated successfully!' : 'Helicopter created successfully!');
        fetchHelicopters();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save helicopter');
      }
    } catch (err) {
      toast.error('Failed to save helicopter');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/helicopters/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Helicopter deleted successfully!');
        fetchHelicopters();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete helicopter');
      }
    } catch (err) {
      toast.error('Failed to delete helicopter');
    }
    setShowDeleteConfirm(null);
  };

  const handleEdit = (helicopter) => {
    setEditingHelicopter(helicopter);
    
    // Ensure helipad_stop_ids is valid JSON
    let helipadStopIds = '[]';
    if (helicopter.helipad_stop_ids) {
      try {
        JSON.parse(helicopter.helipad_stop_ids);
        helipadStopIds = helicopter.helipad_stop_ids;
      } catch (e) {
        helipadStopIds = '[]';
      }
    }
    
    setFormData({
      helicopter_number: helicopter.helicopter_number || '',
      departure_day: helicopter.departure_day || 'Monday',
      start_helipad_id: helicopter.start_helipad_id || '',
      end_helipad_id: helicopter.end_helipad_id || '',
      helipad_stop_ids: helipadStopIds,
      seat_limit: helicopter.seat_limit || 6,
      status: parseInt(helicopter.status) || 1,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHelicopter(null);
    setFormData({
      helicopter_number: '',
      departure_day: 'Monday',
      start_helipad_id: '',
      end_helipad_id: '',
      helipad_stop_ids: '[]',
      seat_limit: 6,
      status: 1,
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredHelicopters = useMemo(() => {
    let filtered = helicopters.filter((helicopter) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        helicopter.helicopter_number?.toLowerCase().includes(searchLower) ||
        helicopter.departure_day?.toLowerCase().includes(searchLower) ||
        getHelipadName(helicopter.start_helipad_id)?.toLowerCase().includes(searchLower) ||
        getHelipadName(helicopter.end_helipad_id)?.toLowerCase().includes(searchLower)
      );

      // Day filter
      const matchesDay = filterDay === 'All Days' || helicopter.departure_day === filterDay;

      // Status filter
      const helicopterStatus = helicopter.status === 1 ? 'Active' : 'Inactive';
      const matchesStatus = filterStatus === 'All' || helicopterStatus === filterStatus;

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
  }, [helicopters, searchTerm, filterDay, filterStatus, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredHelicopters.length / entriesPerPage) || 1;
  const paginatedHelicopters = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredHelicopters.slice(start, start + entriesPerPage);
  }, [filteredHelicopters, currentPage, entriesPerPage]);

  const getHelipadName = (helipadId) => {
    const helipad = helipads.find(h => h.id === parseInt(helipadId));
    return helipad ? `${helipad.helipad_name} (${helipad.helipad_code})` : '';
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-slate-400')} />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-red-500', 'rotate-180')} /> :
      <ArrowsUpDownIcon className={cn('w-4', 'h-4', 'text-red-500')} />;
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
            <div className={cn('p-2', 'bg-gradient-to-r', 'from-red-500', 'to-pink-500', 'rounded-xl')}>
              <CogIcon className={cn('w-8', 'h-8', 'text-white', 'rotate-45')} />
            </div>
            Helicopter Management
          </h1>
          <p className={cn('text-slate-600', 'mt-2')}>Manage your helicopter fleet and specifications</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className={cn('flex', 'items-center', 'gap-2', 'px-6', 'py-3', 'bg-gradient-to-r', 'from-red-500', 'to-pink-500', 'text-white', 'rounded-xl', 'hover:from-red-600', 'hover:to-pink-600', 'transition-all', 'duration-200', 'shadow-lg', 'font-medium')}
        >
          <PlusIcon className={cn('w-5', 'h-5')} />
          Add New Helicopter
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
                className={cn('w-full', 'pl-10', 'pr-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent', 'transition-all')}
                placeholder="Search helicopters by number, day, or helipad..."
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
                  className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
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
                className={cn('px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
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
              className={cn('px-3', 'py-2', 'border', 'border-slate-300', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent')}
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

      {/* Helicopters Table */}
      <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'overflow-hidden')}>
        <div className={cn('bg-gradient-to-r', 'from-red-50', 'to-pink-50', 'px-6', 'py-4', 'border-b', 'border-slate-200')}>
          <h3 className={cn('text-xl', 'font-semibold', 'text-slate-800', 'flex', 'items-center', 'gap-2')}>
            <CogIcon className={cn('w-6', 'h-6', 'text-red-600', 'rotate-45')} />
            Helicopters ({filteredHelicopters.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className={cn('w-full', 'min-w-max')}>
            <thead className={cn('bg-slate-50', 'border-b', 'border-slate-200')}>
              <tr>
                {[
                  { key: 'helicopter_number', label: 'HELICOPTER #', sortable: true },
                  { key: 'departure_day', label: 'DEPARTURE DAY', sortable: true },
                  { key: 'route', label: 'ROUTE', sortable: false },
                  { key: 'seat_limit', label: 'SEAT LIMIT', sortable: true },
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
                  <td colSpan={6} className={cn('px-6', 'py-12', 'text-center')}>
                    <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
                      <div className={cn('w-8', 'h-8', 'border-4', 'border-red-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
                      <span className="text-slate-500">Loading helicopters...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredHelicopters.length === 0 ? (
                <tr>
                  <td colSpan={6} className={cn('px-6', 'py-12', 'text-center')}>
                    <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
                      <CogIcon className={cn('w-12', 'h-12', 'text-slate-300', 'rotate-45')} />
                      <div>
                        <p className={cn('text-slate-500', 'font-medium')}>No helicopters found</p>
                        <p className={cn('text-slate-400', 'text-sm')}>
                          {searchTerm ? "Try adjusting your search terms" : "Add your first helicopter to get started"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedHelicopters.map((helicopter) => (
                  <tr key={helicopter.id} className={cn('hover:bg-slate-50/50', 'transition-colors')}>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <div className={cn('font-semibold', 'text-slate-900', 'text-sm')}>{helicopter.helicopter_number}</div>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <span className={cn('inline-flex', 'items-center', 'px-2.5', 'py-1', 'rounded-full', 'text-xs', 'font-medium', 'bg-blue-100', 'text-blue-800')}>
                        {helicopter.departure_day}
                      </span>
                    </td>
                    <td className={cn('px-4', 'py-3')}>
                      <div className={cn('flex', 'items-center', 'gap-1.5', 'text-xs', 'min-w-[250px]')}>
                        <MapPinIcon className={cn('w-3', 'h-3', 'text-green-500', 'flex-shrink-0')} />
                        <span className={cn('text-slate-700', 'truncate')} title={getHelipadName(helicopter.start_helipad_id) || 'Not set'}>
                          {getHelipadName(helicopter.start_helipad_id) || 'Not set'}
                        </span>
                        <span className={cn('text-slate-400', 'mx-1')}>→</span>
                        <MapPinIcon className={cn('w-3', 'h-3', 'text-red-500', 'flex-shrink-0')} />
                        <span className={cn('text-slate-700', 'truncate')} title={getHelipadName(helicopter.end_helipad_id) || 'Not set'}>
                          {getHelipadName(helicopter.end_helipad_id) || 'Not set'}
                        </span>
                      </div>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <div className={cn('flex', 'items-center', 'gap-1.5', 'text-slate-700')}>
                        <UsersIcon className={cn('w-3.5', 'h-3.5')} />
                        <span className="text-sm">{helicopter.seat_limit}</span>
                      </div>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(helicopter.status)}`}>
                        {getStatusText(helicopter.status)}
                      </span>
                    </td>
                    <td className={cn('px-4', 'py-3', 'whitespace-nowrap')}>
                      <div className={cn('flex', 'items-center', 'gap-1.5')}>
                        <button
                          onClick={() => handleEdit(helicopter)}
                          className={cn('p-1.5', 'text-blue-600', 'hover:bg-blue-50', 'rounded-lg', 'transition-colors')}
                          title="Edit helicopter"
                        >
                          <PencilIcon className={cn('w-4', 'h-4')} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(helicopter)}
                          className={cn('p-1.5', 'text-red-600', 'hover:bg-red-50', 'rounded-lg', 'transition-colors')}
                          title="Delete helicopter"
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
        {!loading && filteredHelicopters.length > 0 && (
          <div className={cn('px-6', 'py-4', 'border-t', 'border-slate-200', 'bg-slate-50')}>
            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'items-center', 'justify-between', 'gap-4')}>
              <div className={cn('text-sm', 'text-slate-600')}>
                Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, filteredHelicopters.length)} of {filteredHelicopters.length} entries
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
                              ? 'bg-red-500 text-white'
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
                    {editingHelicopter ? 'Edit Helicopter' : 'Add New Helicopter'}
                  </Dialog.Title>
                  <button
                    onClick={handleCloseModal}
                    className={cn('p-2', 'hover:bg-slate-100', 'rounded-lg', 'transition-colors')}
                  >
                    <XMarkIcon className={cn('w-5', 'h-5', 'text-slate-500')} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className={cn('p-6', 'space-y-6')}>
                  <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Helicopter Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.helicopter_number}
                        onChange={(e) => setFormData({ ...formData, helicopter_number: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent')}
                        placeholder="e.g., H-001"
                      />
                    </div>

                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Departure Day *
                      </label>
                      <select
                        required
                        value={formData.departure_day}
                        onChange={(e) => setFormData({ ...formData, departure_day: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent')}
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Start Helipad *
                      </label>
                      <select
                        required
                        value={formData.start_helipad_id}
                        onChange={(e) => setFormData({ ...formData, start_helipad_id: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent')}
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
                        End Helipad *
                      </label>
                      <select
                        required
                        value={formData.end_helipad_id}
                        onChange={(e) => setFormData({ ...formData, end_helipad_id: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent')}
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
                        Seat Limit *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.seat_limit}
                        onChange={(e) => setFormData({ ...formData, seat_limit: e.target.value })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent')}
                        placeholder="e.g., 6"
                      />
                    </div>

                    <div>
                      <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
                        Status
                      </label>
                      <select
                        value={String(formData.status)}
                        onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                        className={cn('w-full', 'px-4', 'py-3', 'border', 'border-slate-300', 'rounded-xl', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:border-transparent')}
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
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
                          const parsed = JSON.parse(formData.helipad_stop_ids || '[]');
                          currentStops = Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                          currentStops = [];
                        }
                        const isSelected = Array.isArray(currentStops) && currentStops.includes(helipad.id);
                        
                        return (
                          <label key={helipad.id} className={cn('flex', 'items-center', 'space-x-2', 'cursor-pointer')}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                try {
                                  let newStops = Array.isArray(currentStops) ? [...currentStops] : [];
                                  if (e.target.checked) {
                                    newStops.push(helipad.id);
                                  } else {
                                    newStops = newStops.filter(id => id !== helipad.id);
                                  }
                                  setFormData({ ...formData, helipad_stop_ids: JSON.stringify(newStops) });
                                } catch (error) {
                                  setFormData({ ...formData, helipad_stop_ids: '[]' });
                                }
                              }}
                              className={cn('rounded', 'border-slate-300', 'text-red-600', 'focus:ring-red-500')}
                            />
                            <span className={cn('text-sm', 'text-slate-700')}>
                              {helipad.helipad_name} ({helipad.helipad_code})
                            </span>
                          </label>
                        );
                      })}
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
                      className={cn('px-6', 'py-3', 'bg-gradient-to-r', 'from-red-500', 'to-pink-500', 'text-white', 'rounded-xl', 'hover:from-red-600', 'hover:to-pink-600', 'transition-all', 'duration-200', 'shadow-lg')}
                    >
                      {editingHelicopter ? 'Update Helicopter' : 'Create Helicopter'}
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
                        Delete Helicopter
                      </Dialog.Title>
                      <p className={cn('text-sm', 'text-slate-600')}>
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  
                  <p className={cn('text-slate-700', 'mb-6')}>
                    Are you sure you want to delete "{showDeleteConfirm?.helicopter_number}"? 
                    This will permanently remove the helicopter and all associated data.
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
                      Delete Helicopter
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