"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaCheck,
    FaEdit,
    FaFilter,
    FaHotel,
    FaPlus,
    FaSearch,
    FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";

const RoomAvailabilityManagement = () => {
  const [availability, setAvailability] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomId: "",
    date: "",
    isAvailable: true,
    price: ""
  });

  // Get date range for the next 30 days
  const getDateRange = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dateRange = getDateRange();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hotels, rooms, and availability in parallel
        const [hotelsResponse, roomsResponse, availabilityResponse] = await Promise.all([
          API.hotels.getHotels(),
          API.hotels.getRooms(),
          API.hotels.getRoomAvailability()
        ]);

        if (hotelsResponse.data && Array.isArray(hotelsResponse.data)) {
          setHotels(hotelsResponse.data);
        } else {
          setHotels([]);
        }

        if (roomsResponse.data && Array.isArray(roomsResponse.data)) {
          setRooms(roomsResponse.data);
        } else {
          setRooms([]);
        }

        if (availabilityResponse.data && Array.isArray(availabilityResponse.data)) {
          setAvailability(availabilityResponse.data);
        } else {
          setAvailability([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
        setAvailability([]);
        setHotels([]);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter availability based on search and filters
  const filteredAvailability = availability.filter(avail => {
    // For availability data, room info might come nested with hotel data
    const room = avail.room || rooms.find(r => r.id === avail.roomId);
    const hotel = room?.hotel || hotels.find(h => h.id === room?.hotelId);
    
    const matchesSearch = room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room?.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHotel = selectedHotel === "" || 
                        room?.hotelId?.toString() === selectedHotel || 
                        room?.hotel?.id?.toString() === selectedHotel ||
                        hotel?.id?.toString() === selectedHotel;
    const matchesDate = selectedDate === "" || avail.date.split('T')[0] === selectedDate;
    
    return matchesSearch && matchesHotel && matchesDate;
  });

  // Group availability by date for calendar view
  const availabilityByDate = {};
  filteredAvailability.forEach(avail => {
    const dateKey = avail.date.split('T')[0]; // Extract YYYY-MM-DD from ISO timestamp
    if (!availabilityByDate[dateKey]) {
      availabilityByDate[dateKey] = [];
    }
    availabilityByDate[dateKey].push(avail);
  });

  // Admin Functions
  const handleAddAvailability = () => {
    setFormData({
      roomId: "",
      date: "",
      isAvailable: true,
      price: ""
    });
    setShowAddModal(true);
  };

  const handleEditAvailability = (avail) => {
    setFormData({
      roomId: avail.roomId.toString(),
      date: avail.date.split('T')[0], // Convert ISO timestamp to YYYY-MM-DD for date input
      isAvailable: avail.isAvailable,
      price: avail.price || ""
    });
    setSelectedAvailability(avail);
    setShowEditModal(true);
  };

  const handleDeleteAvailability = async (availId) => {
    if (confirm('Are you sure you want to delete this availability record?')) {
      try {
        await API.hotels.deleteRoomAvailability(availId);
        setAvailability(prev => prev.filter(a => a.id !== availId));
        toast.success('Availability record deleted successfully!');
      } catch (error) {
        console.error('Error deleting availability:', error);
        toast.error('Failed to delete availability record. Please try again.');
      }
    }
  };

  const handleSubmitAvailability = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        roomId: parseInt(formData.roomId),
        date: formData.date + 'T00:00:00Z', // Convert date to ISO timestamp format
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (showEditModal && selectedAvailability) {
        // Update existing availability
        const response = await API.hotels.updateRoomAvailability(selectedAvailability.id, submitData);
        setAvailability(prev => prev.map(a => a.id === selectedAvailability.id ? { ...a, ...submitData } : a));
        toast.success('Availability updated successfully!');
      } else {
        // Create new availability
        const response = await API.hotels.createRoomAvailability(submitData);
        const newAvailability = response.data || { id: Date.now(), ...submitData, createdAt: new Date().toISOString() };
        setAvailability(prev => [...prev, newAvailability]);
        toast.success('Availability created successfully!');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedAvailability(null);
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to save availability. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getRoomInfo = (roomId, availabilityItem = null) => {
    // If we have availability item with nested room data, use that first
    if (availabilityItem?.room) {
      const room = availabilityItem.room;
      const hotel = room.hotel || hotels.find(h => h.id === room.hotelId);
      return { room, hotel };
    }
    
    // Otherwise, look up room from rooms array
    const room = rooms.find(r => r.id === roomId);
    const hotel = room ? hotels.find(h => h.id === room.hotelId) : null;
    return { room, hotel };
  };

  const SkeletonCard = () => (
    <div className={cn('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'p-4')}>
      <div className={cn('h-4', 'bg-gray-200', 'rounded', 'animate-pulse', 'mb-2')}></div>
      <div className={cn('h-6', 'bg-gray-200', 'rounded', 'animate-pulse', 'mb-4')}></div>
      <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
        <div className={cn('h-8', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
        <div className={cn('h-8', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
      </div>
    </div>
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
                  <FaCalendarAlt className="text-blue-600" />
                  Room Availability Management
                </h1>
                <p className={cn('text-gray-600', 'mt-1')}>Manage room availability and dynamic pricing</p>
              </div>
              <button className={cn('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2', 'font-medium')}>
                <FaPlus />
                Add Availability
              </button>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
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
                <FaCalendarAlt className="text-blue-600" />
                Room Availability Management
              </h1>
              <p className={cn('text-gray-600', 'mt-1')}>Manage room availability and dynamic pricing</p>
            </div>
            <button 
              onClick={handleAddAvailability}
              className={cn('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2', 'font-medium')}
            >
              <FaPlus />
              Add Availability
            </button>
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
                placeholder="Search rooms..."
                className={cn('w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
            >
              <option value="">All Hotels</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
              ))}
            </select>

            <input
              type="date"
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

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
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Records</p>
                <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>{availability.length}</p>
              </div>
              <div className={cn('bg-blue-100', 'p-3', 'rounded-full')}>
                <FaCalendarAlt className={cn('text-blue-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Available Rooms</p>
                <p className={cn('text-3xl', 'font-bold', 'text-green-600')}>
                  {availability.filter(a => a.isAvailable).length}
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
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Unavailable</p>
                <p className={cn('text-3xl', 'font-bold', 'text-red-600')}>
                  {availability.filter(a => !a.isAvailable).length}
                </p>
              </div>
              <div className={cn('bg-red-100', 'p-3', 'rounded-full')}>
                <FaTimes className={cn('text-red-600', 'text-xl')} />
              </div>
            </div>
          </div>

          <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'p-6')}>
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Hotels Covered</p>
                <p className={cn('text-3xl', 'font-bold', 'text-purple-600')}>
                  {new Set(rooms.filter(r => availability.some(a => a.roomId === r.id)).map(r => r.hotelId)).size}
                </p>
              </div>
              <div className={cn('bg-purple-100', 'p-3', 'rounded-full')}>
                <FaHotel className={cn('text-purple-600', 'text-xl')} />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'mb-6')}>
          <div className={cn('p-6', 'border-b', 'border-gray-200')}>
            <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Availability Calendar</h3>
            <p className={cn('text-sm', 'text-gray-600')}>Next 30 days room availability overview</p>
          </div>
          
          <div className={cn('p-6')}>
            <div className={cn('grid', 'grid-cols-7', 'gap-2', 'mb-4')}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={cn('text-center', 'text-sm', 'font-medium', 'text-gray-600', 'py-2')}>
                  {day}
                </div>
              ))}
            </div>
            
            <div className={cn('grid', 'grid-cols-7', 'gap-2')}>
              {dateRange.slice(0, 21).map(date => {
                const dayAvailability = availabilityByDate[date] || [];
                const availableCount = dayAvailability.filter(a => a.isAvailable).length;
                const totalCount = dayAvailability.length;
                const availabilityPercentage = totalCount > 0 ? (availableCount / totalCount) * 100 : 0;
                
                return (
                  <div
                    key={date}
                    className={cn(
                      'border', 'rounded-lg', 'p-2', 'text-center', 'cursor-pointer', 'hover:bg-gray-50',
                      availabilityPercentage > 70 ? 'bg-green-50 border-green-200' :
                      availabilityPercentage > 30 ? 'bg-yellow-50 border-yellow-200' :
                      totalCount > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    )}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className={cn('text-sm', 'font-medium')}>
                      {new Date(date + 'T00:00:00').getDate()}
                    </div>
                    <div className={cn('text-xs', 'text-gray-600')}>
                      {availableCount}/{totalCount}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Availability List */}
        <div className={cn('bg-white', 'rounded-lg', 'shadow-sm', 'border')}>
          <div className={cn('p-6', 'border-b', 'border-gray-200')}>
            <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>Availability Records</h3>
            <p className={cn('text-sm', 'text-gray-600')}>Manage individual room availability and pricing</p>
          </div>
          
          <div className={cn('overflow-x-auto')}>
            <table className={cn('w-full')}>
              <thead className={cn('bg-gray-50')}>
                <tr>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Room
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Hotel
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Date
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Status
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Price
                  </th>
                  <th className={cn('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider')}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn('bg-white', 'divide-y', 'divide-gray-200')}>
                {filteredAvailability.map((avail) => {
                  const { room, hotel } = getRoomInfo(avail.roomId, avail);
                  return (
                    <motion.tr
                      key={avail.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn('hover:bg-gray-50')}
                    >
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <div className={cn('text-sm', 'font-medium', 'text-gray-900')}>
                          Room {room?.roomNumber || room?.room_number || 'Unknown'}
                        </div>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <div className={cn('text-sm', 'text-gray-900')}>
                          {hotel?.name || 'Unknown Hotel'}
                        </div>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <div className={cn('text-sm', 'text-gray-900')}>
                          {new Date(avail.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <span className={cn(
                          'inline-flex', 'px-2', 'py-1', 'text-xs', 'font-semibold', 'rounded-full',
                          avail.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        )}>
                          {avail.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap')}>
                        <div className={cn('text-sm', 'text-gray-900')}>
                          ₹{avail.price || room?.basePrice || room?.base_price || 'N/A'}
                        </div>
                      </td>
                      <td className={cn('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium')}>
                        <div className={cn('flex', 'gap-2')}>
                          <button
                            onClick={() => handleEditAvailability(avail)}
                            className={cn('text-indigo-600', 'hover:text-indigo-900')}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteAvailability(avail.id)}
                            className={cn('text-red-600', 'hover:text-red-900')}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAvailability.length === 0 && (
            <div className={cn('text-center', 'py-12')}>
              <FaCalendarAlt className={cn('mx-auto', 'text-gray-400', 'text-6xl', 'mb-4')} />
              <h3 className={cn('text-xl', 'font-medium', 'text-gray-900', 'mb-2')}>No availability records found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add new availability records.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Availability Modal */}
      {(showAddModal || showEditModal) && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-md', 'w-full')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
                  {showEditModal ? 'Edit Availability' : 'Add Availability'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedAvailability(null);
                  }}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitAvailability} className={cn('p-6', 'space-y-4')}>
              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Room *</label>
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  required
                  className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => {
                    const hotel = hotels.find(h => h.id === room.hotelId);
                    return (
                      <option key={room.id} value={room.id}>
                        {hotel?.name || 'Unknown Hotel'} - Room {room.roomNumber || room.room_number || 'N/A'}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                />
              </div>

              <div>
                <label className={cn('flex', 'items-center', 'space-x-2')}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className={cn('rounded', 'border-gray-300', 'text-blue-600', 'focus:ring-blue-500')}
                  />
                  <span className={cn('text-sm', 'font-medium', 'text-gray-700')}>Room is available</span>
                </label>
              </div>

              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>
                  Custom Price (Optional)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                  placeholder="Leave empty to use base price"
                />
              </div>

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedAvailability(null);
                  }}
                  className={cn('px-4', 'py-2', 'text-gray-700', 'bg-gray-200', 'rounded-lg', 'hover:bg-gray-300', 'transition-colors')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn('px-6', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'flex', 'items-center', 'gap-2')}
                >
                  {submitting ? (
                    <>
                      <div className={cn('animate-spin', 'rounded-full', 'h-4', 'w-4', 'border-b-2', 'border-white')}></div>
                      {showEditModal ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    showEditModal ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAvailabilityManagement;