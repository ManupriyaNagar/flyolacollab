"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaBed,
  FaBuilding,
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [formData, setFormData] = useState({
    room_number: "",
    hotel_id: "",
    category_id: "",
    floor: "1",
    description: "",
    status: "available",
    base_price: "0",
    single_price: "0",
    double_price: "0",
    extra_person_price: "0",
    max_extra_persons: "0"
  });



  const statusOptions = [
    { value: "available", label: "Available", color: "bg-green-100 text-green-800" },
    { value: "occupied", label: "Occupied", color: "bg-red-100 text-red-800" },
    { value: "maintenance", label: "Maintenance", color: "bg-yellow-100 text-yellow-800" },
    { value: "out_of_order", label: "Out of Order", color: "bg-gray-100 text-gray-800" }
  ];

  useEffect(() => {
    fetchRooms();
    fetchHotels();
    fetchRoomCategories();
  }, []);

  // Debug: Log available data
  useEffect(() => {
    console.log('Available hotels:', hotels);
    console.log('Available room categories:', roomCategories);
  }, [hotels, roomCategories]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await API.hotels.getRooms();
      if (response && response.data) {
        // Map the database response to match our component's expected format
        const mappedRooms = response.data.map(room => ({
          id: room.id,
          room_number: room.roomNumber || room.room_number || room.RoomNumber,
          hotel_id: room.hotelId || room.hotel_id || room.HotelID,
          hotel_name: room.hotel?.name || room.Hotel?.name || 'Unknown Hotel',
          category_id: room.roomCategoryId || room.room_category_id || room.RoomCategoryID,
          category_name: room.roomCategory?.name || room.RoomCategory?.name || room.room_category?.name || 'Unknown Category',
          floor: room.floor || room.Floor || 0,
          description: room.description || room.Description || '',
          status: room.status === 0 ? 'available' : room.status === 1 ? 'occupied' : room.status === 2 ? 'maintenance' : 'out_of_order',
          base_price: room.basePrice || room.base_price || room.BasePrice || 0,
          single_price: room.singlePrice || room.single_price || room.SinglePrice || 0,
          double_price: room.doublePrice || room.double_price || room.DoublePrice || 0,
          extra_person_price: room.extraPersonPrice || room.extra_person_price || room.ExtraPersonPrice || 0,
          max_extra_persons: room.maxExtraPersons || room.max_extra_persons || room.MaxExtraPersons || 0,
          created_at: room.createdAt || room.created_at || room.CreatedAt,
          updated_at: room.updatedAt || room.updated_at || room.UpdatedAt
        }));
        setRooms(mappedRooms);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await API.hotels.getHotels();
      if (response && response.data && Array.isArray(response.data)) {
        setHotels(response.data);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast.error("Failed to fetch hotels");
      setHotels([]);
    }
  };

  const fetchRoomCategories = async () => {
    try {
      const response = await API.hotels.getRoomCategories();
      if (response && response.data && Array.isArray(response.data)) {
        setRoomCategories(response.data);
      } else {
        setRoomCategories([]);
      }
    } catch (error) {
      console.error("Error fetching room categories:", error);
      toast.error("Failed to fetch room categories");
      setRoomCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if required data is loaded
    if (hotels.length === 0) {
      toast.error("No hotels available. Please add hotels first.");
      return;
    }
    if (roomCategories.length === 0) {
      toast.error("No room categories available. Please add room categories first.");
      return;
    }
    
    // Validation
    if (!formData.room_number.trim()) {
      toast.error("Room number is required");
      return;
    }
    if (!formData.hotel_id || formData.hotel_id === "") {
      toast.error("Please select a hotel");
      return;
    }
    if (!formData.category_id || formData.category_id === "") {
      toast.error("Please select a room category");
      return;
    }

    setSubmitting(true);
    try {
      // Convert status to numeric for API and ensure proper data types
      const submitData = {
        room_number: formData.room_number.trim(),
        hotel_id: parseInt(formData.hotel_id),
        room_category_id: parseInt(formData.category_id),
        floor: parseInt(formData.floor) || 1,
        description: formData.description.trim(),
        base_price: parseFloat(formData.base_price) || 0,
        single_price: parseFloat(formData.single_price) || 0,
        double_price: parseFloat(formData.double_price) || 0,
        extra_person_price: parseFloat(formData.extra_person_price) || 0,
        max_extra_persons: parseInt(formData.max_extra_persons) || 0,
        status: formData.status === 'available' ? 0 : 
                formData.status === 'occupied' ? 1 : 
                formData.status === 'maintenance' ? 2 : 3
      };

      // Validate that IDs are valid numbers
      if (isNaN(submitData.hotel_id) || submitData.hotel_id <= 0) {
        toast.error("Please select a valid hotel");
        return;
      }
      if (isNaN(submitData.room_category_id) || submitData.room_category_id <= 0) {
        toast.error("Please select a valid room category");
        return;
      }

      console.log('Submitting room data:', submitData);

      if (editingRoom) {
        await API.hotels.updateRoom(editingRoom.id, submitData);
        toast.success("Room updated successfully");
      } else {
        await API.hotels.createRoom(submitData);
        toast.success("Room added successfully");
      }
      resetForm();
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to save room";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number || "",
      hotel_id: room.hotel_id?.toString() || "",
      category_id: room.category_id?.toString() || "",
      floor: room.floor?.toString() || "1",
      description: room.description || "",
      status: room.status || "available",
      base_price: room.base_price?.toString() || "0",
      single_price: room.single_price?.toString() || "0",
      double_price: room.double_price?.toString() || "0",
      extra_person_price: room.extra_person_price?.toString() || "0",
      max_extra_persons: room.max_extra_persons?.toString() || "0"
    });
    setShowAddForm(true);
  };

  const handleDelete = async (roomId) => {
    // Note: Delete endpoint not implemented in backend yet
    toast.error("Delete functionality is not available yet. Please contact the administrator.");
    return;
    
  };

  const resetForm = () => {
    setFormData({
      room_number: "",
      hotel_id: "",
      category_id: "",
      floor: "1",
      description: "",
      status: "available",
      base_price: "0",
      single_price: "0",
      double_price: "0",
      extra_person_price: "0",
      max_extra_persons: "0"
    });
    setEditingRoom(null);
    setShowAddForm(false);
  };



  const filteredRooms = rooms.filter(room => {
    const roomNumber = room.room_number || '';
    const hotelName = room.hotel_name || '';
    const categoryName = room.category_name || '';
    
    const matchesSearch = roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHotel = !selectedHotel || room.hotel_name === selectedHotel;
    const matchesStatus = !selectedStatus || room.status === selectedStatus;
    
    return matchesSearch && matchesHotel && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color}>
        {statusConfig?.label}
      </Badge>
    );
  };



  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>
      {/* Header */}
      <div className={cn('bg-white', 'shadow-sm', 'border-b')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
                <FaBed className="text-blue-600" />
                Room Management
              </h1>
              <p className={cn('text-gray-600', 'mt-1')}>Manage hotel rooms and their details</p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className={cn('bg-blue-600', 'hover:bg-blue-700', 'flex', 'items-center', 'gap-2')}
            >
              <FaPlus className={cn('w-4', 'h-4')} />
              Add Room
            </Button>
          </div>
        </div>
      </div>

      <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
        {/* Stats Cards */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6', 'mb-8')}>
          <Card>
            <CardContent className="p-6">
              <div className={cn('flex', 'items-center', 'justify-between')}>
                <div>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Rooms</p>
                  <p className={cn('text-3xl', 'font-bold', 'text-gray-900')}>{rooms.length}</p>
                </div>
                <div className={cn('bg-blue-100', 'p-3', 'rounded-full')}>
                  <FaBed className={cn('text-blue-600', 'text-xl')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className={cn('flex', 'items-center', 'justify-between')}>
                <div>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Available</p>
                  <p className={cn('text-3xl', 'font-bold', 'text-green-600')}>
                    {rooms.filter(r => r.status === 'available').length}
                  </p>
                </div>
                <div className={cn('bg-green-100', 'p-3', 'rounded-full')}>
                  <FaBed className={cn('text-green-600', 'text-xl')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className={cn('flex', 'items-center', 'justify-between')}>
                <div>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Occupied</p>
                  <p className={cn('text-3xl', 'font-bold', 'text-red-600')}>
                    {rooms.filter(r => r.status === 'occupied').length}
                  </p>
                </div>
                <div className={cn('bg-red-100', 'p-3', 'rounded-full')}>
                  <FaBed className={cn('text-red-600', 'text-xl')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className={cn('flex', 'items-center', 'justify-between')}>
                <div>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Hotels</p>
                  <p className={cn('text-3xl', 'font-bold', 'text-purple-600')}>
                    {new Set(rooms.map(r => r.hotel_id)).size}
                  </p>
                </div>
                <div className={cn('bg-purple-100', 'p-3', 'rounded-full')}>
                  <FaBuilding className={cn('text-purple-600', 'text-xl')} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4')}>
              <div className="relative">
                <FaSearch className={cn('absolute', 'left-3', 'top-1/2', 'transform', '-translate-y-1/2', 'text-gray-400')} />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className={cn('px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              >
                <option value="">All Hotels</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.name}>
                    {hotel.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={cn('px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <Button variant="outline" className={cn('flex', 'items-center', 'gap-2')}>
           
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <div className={cn('flex', 'items-center', 'justify-between')}>
                <CardTitle className={cn('flex', 'items-center', 'gap-2')}>
                  <FaBed className="text-blue-600" />
                  {editingRoom ? "Edit Room" : "Add New Room"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className={cn('text-gray-500', 'hover:text-gray-700')}
                >
                  <FaTimes />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4')}>
                  <div>
                    <Label htmlFor="room_number">Room Number *</Label>
                    <Input
                      id="room_number"
                      value={formData.room_number}
                      onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                      placeholder="e.g., 101, A-201"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hotel_id">Hotel *</Label>
                    <select
                      id="hotel_id"
                      value={formData.hotel_id}
                      onChange={(e) => setFormData({...formData, hotel_id: e.target.value})}
                      className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                      required
                    >
                      <option value="">Select Hotel</option>
                      {hotels.length === 0 ? (
                        <option disabled>No hotels available</option>
                      ) : (
                        hotels.map(hotel => (
                          <option key={hotel.id} value={hotel.id}>
                            {hotel.name}
                          </option>
                        ))
                      )}
                    </select>
                    {hotels.length === 0 && (
                      <p className={cn('text-sm', 'text-red-600', 'mt-1')}>
                        No hotels found. Please add hotels first.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="category_id">Room Category *</Label>
                    <select
                      id="category_id"
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                      required
                    >
                      <option value="">Select Category</option>
                      {roomCategories.length === 0 ? (
                        <option disabled>No categories available</option>
                      ) : (
                        roomCategories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    {roomCategories.length === 0 && (
                      <p className={cn('text-sm', 'text-red-600', 'mt-1')}>
                        No room categories found. Please add room categories first.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      type="number"
                      value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: e.target.value})}
                      placeholder="1"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="base_price">Base Price (₹)</Label>
                    <Input
                      id="base_price"
                      type="number"
                      value={formData.base_price}
                      onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="single_price">Single Occupancy (₹)</Label>
                    <Input
                      id="single_price"
                      type="number"
                      value={formData.single_price}
                      onChange={(e) => setFormData({...formData, single_price: e.target.value})}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="double_price">Double Occupancy (₹)</Label>
                    <Input
                      id="double_price"
                      type="number"
                      value={formData.double_price}
                      onChange={(e) => setFormData({...formData, double_price: e.target.value})}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="extra_person_price">Extra Person Price (₹)</Label>
                    <Input
                      id="extra_person_price"
                      type="number"
                      value={formData.extra_person_price}
                      onChange={(e) => setFormData({...formData, extra_person_price: e.target.value})}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    placeholder="Room description and special features..."
                  />
                </div>

                <div className={cn('flex', 'gap-3', 'pt-4')}>
                  <Button 
                    type="submit" 
                    disabled={submitting || hotels.length === 0 || roomCategories.length === 0}
                    className={cn('bg-blue-600', 'hover:bg-blue-700', 'flex', 'items-center', 'gap-2')}
                  >
                    {submitting ? (
                      <>
                        <div className={cn('animate-spin', 'rounded-full', 'h-4', 'w-4', 'border-b-2', 'border-white')}></div>
                        {editingRoom ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <FaPlus className={cn('w-4', 'h-4')} />
                        {editingRoom ? "Update Room" : "Add Room"}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  {(hotels.length === 0 || roomCategories.length === 0) && (
                    <p className={cn('text-sm', 'text-red-600', 'flex', 'items-center')}>
                      {hotels.length === 0 && "Add hotels first. "}
                      {roomCategories.length === 0 && "Add room categories first."}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Rooms Grid */}
        {loading ? (
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className={cn('animate-pulse')}>
                    <div className={cn('h-6', 'bg-gray-200', 'rounded', 'mb-4')}></div>
                    <div className={cn('space-y-2')}>
                      <div className={cn('h-4', 'bg-gray-200', 'rounded')}></div>
                      <div className={cn('h-4', 'bg-gray-200', 'rounded', 'w-3/4')}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <Card>
            <CardContent className={cn('text-center', 'py-12')}>
              <FaBed className={cn('w-16', 'h-16', 'text-gray-400', 'mx-auto', 'mb-4')} />
              <h3 className={cn('text-xl', 'font-medium', 'text-gray-900', 'mb-2')}>No rooms found</h3>
              <p className={cn('text-gray-600', 'mb-4')}>
                {searchTerm || selectedHotel || selectedStatus 
                  ? "Try adjusting your search criteria" 
                  : "Get started by adding your first room"}
              </p>
              {!searchTerm && !selectedHotel && !selectedStatus && (
                <Button onClick={() => setShowAddForm(true)} className={cn('bg-blue-600', 'hover:bg-blue-700')}>
                  <FaPlus className={cn('w-4', 'h-4', 'mr-2')} />
                  Add First Room
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
            {filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={cn('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'overflow-hidden', 'hover:shadow-lg', 'transition-all', 'duration-300')}
              >
                <div className={cn('p-6')}>
                  <div className={cn('flex', 'justify-between', 'items-start', 'mb-4')}>
                    <div>
                      <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-1')}>
                        Room {room.room_number}
                      </h3>
                      <p className={cn('text-sm', 'text-gray-600')}>Floor {room.floor}</p>
                    </div>
                    <Badge className={getStatusBadge(room.status).props.className}>
                      {statusOptions.find(s => s.value === room.status)?.label}
                    </Badge>
                  </div>

                  <div className={cn('space-y-3', 'mb-4')}>
                    <div>
                      <p className={cn('text-sm', 'font-medium', 'text-gray-700')}>Hotel</p>
                      <p className={cn('text-sm', 'text-gray-600')}>{room.hotel_name}</p>
                    </div>
                    <div>
                      <p className={cn('text-sm', 'font-medium', 'text-gray-700')}>Category</p>
                      <p className={cn('text-sm', 'text-gray-600')}>{room.category_name}</p>
                    </div>
                    {room.description && (
                      <div>
                        <p className={cn('text-sm', 'font-medium', 'text-gray-700')}>Description</p>
                        <p className={cn('text-sm', 'text-gray-600', 'line-clamp-2')}>{room.description}</p>
                      </div>
                    )}
                  </div>

                  {(room.single_price > 0 || room.double_price > 0) && (
                    <div className={cn('mb-4', 'p-3', 'bg-gray-50', 'rounded-lg')}>
                      <p className={cn('text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>Pricing</p>
                      <div className={cn('grid', 'grid-cols-2', 'gap-2', 'text-xs')}>
                        {room.single_price > 0 && (
                          <div>
                            <span className="text-gray-500">Single:</span>
                            <span className={cn('font-medium', 'ml-1')}>₹{room.single_price}</span>
                          </div>
                        )}
                        {room.double_price > 0 && (
                          <div>
                            <span className="text-gray-500">Double:</span>
                            <span className={cn('font-medium', 'ml-1')}>₹{room.double_price}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={cn('flex', 'gap-2')}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRoom(room)}
                      className={cn('flex-1', 'flex', 'items-center', 'justify-center', 'gap-2')}
                    >
                      <FaEye className={cn('w-4', 'h-4')} />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(room)}
                      className={cn('flex', 'items-center', 'justify-center')}
                    >
                      <FaEdit className={cn('w-4', 'h-4')} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(room.id)}
                      className={cn('text-red-600', 'hover:text-red-700', 'flex', 'items-center', 'justify-center')}
                    >
                      <FaTrash className={cn('w-4', 'h-4')} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className={cn('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'z-50')}>
          <div className={cn('bg-white', 'rounded-xl', 'max-w-2xl', 'w-full', 'max-h-[80vh]', 'overflow-y-auto')}>
            <div className={cn('p-6', 'border-b', 'border-gray-200')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <h3 className={cn('text-lg', 'font-semibold', 'text-gray-900')}>
                  Room {selectedRoom.room_number} Details
                </h3>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className={cn('text-gray-400', 'hover:text-gray-600')}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className={cn('p-6', 'space-y-4')}>
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Room Number</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedRoom.room_number}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Hotel</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedRoom.hotel_name}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Category</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedRoom.category_name}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Floor</label>
                  <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{selectedRoom.floor}</p>
                </div>
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700')}>Status</label>
                  <Badge className={getStatusBadge(selectedRoom.status).props.className}>
                    {statusOptions.find(s => s.value === selectedRoom.status)?.label}
                  </Badge>
                </div>
              </div>

              {selectedRoom.description && (
                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Description</label>
                  <p className={cn('text-sm', 'text-gray-900', 'bg-gray-50', 'p-3', 'rounded-lg')}>{selectedRoom.description}</p>
                </div>
              )}

              <div>
                <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>Pricing Information</label>
                <div className={cn('grid', 'grid-cols-2', 'gap-4', 'p-4', 'bg-gray-50', 'rounded-lg')}>
                  <div>
                    <span className={cn('text-sm', 'text-gray-600')}>Base Price:</span>
                    <p className="font-medium">₹{selectedRoom.base_price}</p>
                  </div>
                  <div>
                    <span className={cn('text-sm', 'text-gray-600')}>Single Occupancy:</span>
                    <p className="font-medium">₹{selectedRoom.single_price}</p>
                  </div>
                  <div>
                    <span className={cn('text-sm', 'text-gray-600')}>Double Occupancy:</span>
                    <p className="font-medium">₹{selectedRoom.double_price}</p>
                  </div>
                  {selectedRoom.extra_person_price > 0 && (
                    <div>
                      <span className={cn('text-sm', 'text-gray-600')}>Extra Person:</span>
                      <p className="font-medium">₹{selectedRoom.extra_person_price}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={cn('flex', 'justify-end', 'gap-3', 'pt-4')}>
                <Button
                  onClick={() => {
                    setSelectedRoom(null);
                    handleEdit(selectedRoom);
                  }}
                  className={cn('bg-blue-600', 'hover:bg-blue-700', 'flex', 'items-center', 'gap-2')}
                >
                  <FaEdit />
                  Edit Room
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRoom(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}