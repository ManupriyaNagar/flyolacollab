"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    PlusIcon,
    TrashIcon,
    PencilIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    ArrowsUpDownIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import BASE_URL from "@/baseUrl/baseUrl";

export default function HelipadManagementPage() {
    const [helipads, setHelipads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [editingHelipad, setEditingHelipad] = useState(null);
    const [formData, setFormData] = useState({
        helipad_name: '',
        helipad_code: '',
        city: '',
        status: 1,
    });

    useEffect(() => {
        fetchHelipads();
    }, []);

    const fetchHelipads = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/helipads`);
            if (response.ok) {
                const data = await response.json();
                setHelipads(Array.isArray(data) ? data : []);
            } else {
                setHelipads([]);
            }
        } catch (err) {
            toast.error('Failed to fetch helipads');
            setHelipads([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingHelipad
                ? `${BASE_URL}/helipads/${editingHelipad.id}`
                : `${BASE_URL}/helipads`;

            const method = editingHelipad ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingHelipad ? 'Helipad updated successfully!' : 'Helipad created successfully!');
                fetchHelipads();
                handleCloseModal();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to save helipad');
            }
        } catch (err) {
            toast.error('Failed to save helipad');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/helipads/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Helipad deleted successfully!');
                fetchHelipads();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to delete helipad');
            }
        } catch (err) {
            toast.error('Failed to delete helipad');
        }
        setShowDeleteConfirm(null);
    };

    const handleEdit = (helipad) => {
        setEditingHelipad(helipad);
        setFormData({
            helipad_name: helipad.helipad_name || '',
            helipad_code: helipad.helipad_code || '',
            city: helipad.city || '',
            status: parseInt(helipad.status) || 1,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingHelipad(null);
        setFormData({
            helipad_name: '',
            helipad_code: '',
            city: '',
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

    const filteredHelipads = useMemo(() => {
        let filtered = helipads.filter((helipad) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                helipad.helipad_name?.toLowerCase().includes(searchLower) ||
                helipad.helipad_code?.toLowerCase().includes(searchLower) ||
                helipad.city?.toLowerCase().includes(searchLower)
            );
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
    }, [helipads, searchTerm, sortConfig]);

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
        }
        return sortConfig.direction === 'asc' ?
            <ArrowsUpDownIcon className="w-4 h-4 text-orange-500 rotate-180" /> :
            <ArrowsUpDownIcon className="w-4 h-4 text-orange-500" />;
    };

    return (
        <div className="space-y-8">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                            <MapPinIcon className="w-8 h-8 text-white" />
                        </div>
                        Helipad Management
                    </h1>
                    <p className="text-slate-600 mt-2">Manage helicopter landing pads and facilities</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg font-medium"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add New Helipad
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="Search helipads by name, code, or city..."
                        />
                    </div>
                </div>
            </div>

            {/* Helipads Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                        <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
                        Helipads ({filteredHelipads.length})
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {[
                                    { key: 'helipad_name', label: 'Helipad Name', sortable: true },
                                    { key: 'helipad_code', label: 'Code', sortable: true },
                                    { key: 'city', label: 'City', sortable: true },
                                    { key: 'status', label: 'Status', sortable: true },
                                    { key: 'actions', label: 'Actions', sortable: false },
                                ].map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                                            }`}
                                        onClick={column.sortable ? () => handleSort(column.key) : undefined}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.label}
                                            {column.sortable && getSortIcon(column.key)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-slate-500">Loading helipads...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredHelipads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <MapPinIcon className="w-12 h-12 text-slate-300" />
                                            <div>
                                                <p className="text-slate-500 font-medium">No helipads found</p>
                                                <p className="text-slate-400 text-sm">
                                                    {searchTerm ? "Try adjusting your search terms" : "Add your first helipad to get started"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredHelipads.map((helipad) => (
                                    <tr key={helipad.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{helipad.helipad_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                                                {helipad.helipad_code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700">{helipad.city}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${helipad.status === 1
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {helipad.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(helipad)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit helipad"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(helipad)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete helipad"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Transition show={showModal} as={React.Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
                                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                    <Dialog.Title className="text-xl font-semibold text-slate-800">
                                        {editingHelipad ? 'Edit Helipad' : 'Add New Helipad'}
                                    </Dialog.Title>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Helipad Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.helipad_name}
                                                onChange={(e) => setFormData({ ...formData, helipad_name: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter helipad name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Helipad Code *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.helipad_code}
                                                onChange={(e) => setFormData({ ...formData, helipad_code: e.target.value.toUpperCase() })}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                                                placeholder="e.g., HLP001"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter city"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={String(formData.status)}
                                                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg"
                                        >
                                            {editingHelipad ? 'Update Helipad' : 'Create Helipad'}
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
                <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteConfirm(null)}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-lg font-semibold text-slate-800">
                                                Delete Helipad
                                            </Dialog.Title>
                                            <p className="text-sm text-slate-600">
                                                This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-slate-700 mb-6">
                                        Are you sure you want to delete "{showDeleteConfirm?.helipad_name}"?
                                        This will permanently remove the helipad and all associated data.
                                    </p>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setShowDeleteConfirm(null)}
                                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleDelete(showDeleteConfirm.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Delete Helipad
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