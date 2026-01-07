'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from "@/lib/utils";
import API from '@/services/api';
import {
    AlertCircle,
    Calendar,
    Camera,
    CheckCircle,
    Loader2,
    MapPin,
    Mountain,
    Plane,
    Plus,
    Save,
    Star,
    Trash2,
    TreePine
} from 'lucide-react';
import { useEffect, useState } from 'react';

const AddHolidayPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [helipads, setHelipads] = useState([]);

  // Package form data
  const [packageData, setPackageData] = useState({
    title: '',
    description: '',
    package_type: 'spiritual',
    duration_days: 1,
    duration_nights: 0,
    price_per_person: '',
    max_passengers: 6,
    image_url: '',
    terms_conditions: ''
  });

  // Inclusions and exclusions
  const [inclusions, setInclusions] = useState(['']);
  const [exclusions, setExclusions] = useState(['']);

  // Itinerary
  const [itinerary, setItinerary] = useState([{
    day: 1,
    title: '',
    duration: '',
    activities: ['']
  }]);

  // Package schedules
  const [packageSchedules, setPackageSchedules] = useState([{
    schedule_type: 'helicopter',
    schedule_id: '',
    sequence_order: 1,
    day_number: 1,
    is_return: false
  }]);

  useEffect(() => {
    fetchSchedulesAndHelipads();
  }, []);

  const fetchSchedulesAndHelipads = async () => {
    try {
      const [helicopterData, helipadData] = await Promise.all([
        API.client.get('/helicopter-schedules'),
        API.client.get('/helipads')
      ]);

      setSchedules(helicopterData.data);
      setHelipads(helipadData.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setPackageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInclusionChange = (index, value) => {
    const newInclusions = [...inclusions];
    newInclusions[index] = value;
    setInclusions(newInclusions);
  };

  const addInclusion = () => {
    setInclusions([...inclusions, '']);
  };

  const removeInclusion = (index) => {
    if (inclusions.length > 1) {
      setInclusions(inclusions.filter((_, i) => i !== index));
    }
  };

  const handleExclusionChange = (index, value) => {
    const newExclusions = [...exclusions];
    newExclusions[index] = value;
    setExclusions(newExclusions);
  };

  const addExclusion = () => {
    setExclusions([...exclusions, '']);
  };

  const removeExclusion = (index) => {
    if (exclusions.length > 1) {
      setExclusions(exclusions.filter((_, i) => i !== index));
    }
  };

  const handleItineraryChange = (dayIndex, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex] = {
      ...newItinerary[dayIndex],
      [field]: value
    };
    setItinerary(newItinerary);
  };

  const handleActivityChange = (dayIndex, activityIndex, value) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities[activityIndex] = value;
    setItinerary(newItinerary);
  };

  const addActivity = (dayIndex) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push('');
    setItinerary(newItinerary);
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...itinerary];
    if (newItinerary[dayIndex].activities.length > 1) {
      newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter((_, i) => i !== activityIndex);
      setItinerary(newItinerary);
    }
  };

  const addItineraryDay = () => {
    setItinerary([...itinerary, {
      day: itinerary.length + 1,
      title: '',
      duration: '',
      activities: ['']
    }]);
  };

  const removeItineraryDay = (index) => {
    if (itinerary.length > 1) {
      setItinerary(itinerary.filter((_, i) => i !== index));
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...packageSchedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: value
    };
    setPackageSchedules(newSchedules);
  };

  const addSchedule = () => {
    setPackageSchedules([...packageSchedules, {
      schedule_type: 'helicopter',
      schedule_id: '',
      sequence_order: packageSchedules.length + 1,
      day_number: 1,
      is_return: false
    }]);
  };

  const removeSchedule = (index) => {
    if (packageSchedules.length > 1) {
      setPackageSchedules(packageSchedules.filter((_, i) => i !== index));
    }
  };

  const getPackageIcon = (type) => {
    switch (type) {
      case 'spiritual':
        return <Mountain className={cn('w-5', 'h-5')} />;
      case 'wildlife':
        return <TreePine className={cn('w-5', 'h-5')} />;
      case 'adventure':
        return <Camera className={cn('w-5', 'h-5')} />;
      case 'cultural':
        return <Star className={cn('w-5', 'h-5')} />;
      default:
        return <Plane className={cn('w-5', 'h-5')} />;
    }
  };

  const getScheduleDetails = (scheduleId) => {
    const schedule = schedules.find(s => s.id === parseInt(scheduleId));
    if (!schedule) return 'Select a schedule';
    
    const departureHelipad = helipads.find(h => h.id === schedule.departure_helipad_id);
    const arrivalHelipad = helipads.find(h => h.id === schedule.arrival_helipad_id);
    
    return `${departureHelipad?.helipad_name || 'Unknown'} → ${arrivalHelipad?.helipad_name || 'Unknown'} (${schedule.departure_time} - ${schedule.arrival_time})`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare the package data
      const packagePayload = {
        ...packageData,
        price_per_person: parseFloat(packageData.price_per_person),
        inclusions: inclusions.filter(inc => inc.trim() !== ''),
        exclusions: exclusions.filter(exc => exc.trim() !== ''),
        itinerary: itinerary.map(day => ({
          ...day,
          activities: day.activities.filter(activity => activity.trim() !== '')
        })),
        package_schedules: packageSchedules.filter(schedule => schedule.schedule_id !== '')
      };

      const response = await API.holidayPackages.createPackage(packagePayload);

      if (response.success) {
        setSuccess(true);
        // Reset form
        setPackageData({
          title: '',
          description: '',
          package_type: 'spiritual',
          duration_days: 1,
          duration_nights: 0,
          price_per_person: '',
          max_passengers: 6,
          image_url: '',
          terms_conditions: ''
        });
        setInclusions(['']);
        setExclusions(['']);
        setItinerary([{
          day: 1,
          title: '',
          duration: '',
          activities: ['']
        }]);
        setPackageSchedules([{
          schedule_type: 'helicopter',
          schedule_id: '',
          sequence_order: 1,
          day_number: 1,
          is_return: false
        }]);
      } else {
        setError(response.error || 'Failed to create package');
      }
    } catch (err) {
      setError('Error creating package: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn('flex', 'items-center', 'justify-between')}>
        <div>
          <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
            <div className={cn('w-10', 'h-10', 'bg-gradient-to-r', 'from-orange-400', 'to-red-400', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
              <Plus className={cn('w-6', 'h-6', 'text-white')} />
            </div>
            Add Holiday Package
          </h1>
          <p className={cn('text-gray-600', 'mt-2')}>Create a new holiday package with schedules and itinerary</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={cn('bg-green-50', 'border', 'border-green-200', 'rounded-lg', 'p-4', 'flex', 'items-center', 'gap-3')}>
          <CheckCircle className={cn('w-5', 'h-5', 'text-green-600')} />
          <span className="text-green-800">Holiday package created successfully!</span>
        </div>
      )}

      {error && (
        <div className={cn('bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'p-4', 'flex', 'items-center', 'gap-3')}>
          <AlertCircle className={cn('w-5', 'h-5', 'text-red-600')} />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className={cn('grid', 'w-full', 'grid-cols-4')}>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className={cn('flex', 'items-center', 'gap-2')}>
                  <MapPin className={cn('w-5', 'h-5')} />
                  Basic Package Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')}>
                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                      Package Title *
                    </label>
                    <input
                      type="text"
                      value={packageData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                      placeholder="e.g., Maihar VIP Darshan - Jabalpur Return"
                      required
                    />
                  </div>

                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                      Package Type *
                    </label>
                    <select
                      value={packageData.package_type}
                      onChange={(e) => handleInputChange('package_type', e.target.value)}
                      className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    >
                      <option value="spiritual">Spiritual</option>
                      <option value="wildlife">Wildlife</option>
                      <option value="adventure">Adventure</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>

                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                      Duration (Days) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={packageData.duration_days}
                      onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value))}
                      className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    />
                  </div>

                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                      Duration (Nights)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={packageData.duration_nights}
                      onChange={(e) => handleInputChange('duration_nights', parseInt(e.target.value))}
                      className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    />
                  </div>

                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                      Price per Person (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={packageData.price_per_person}
                      onChange={(e) => handleInputChange('price_per_person', e.target.value)}
                      className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                      placeholder="16000"
                      required
                    />
                  </div>

                  <div>
                    <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                      Max Passengers
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={packageData.max_passengers}
                      onChange={(e) => handleInputChange('max_passengers', parseInt(e.target.value))}
                      className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    />
                  </div>
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                    Description *
                  </label>
                  <textarea
                    value={packageData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="Describe the holiday package..."
                    required
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={packageData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <div className="space-y-6">
              {/* Inclusions */}
              <Card>
                <CardHeader>
                  <CardTitle className={cn('flex', 'items-center', 'gap-2')}>
                    <CheckCircle className={cn('w-5', 'h-5', 'text-green-600')} />
                    Package Inclusions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inclusions.map((inclusion, index) => (
                      <div key={index} className={cn('flex', 'items-center', 'gap-3')}>
                        <input
                          type="text"
                          value={inclusion}
                          onChange={(e) => handleInclusionChange(index, e.target.value)}
                          className={cn('flex-1', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                          placeholder="e.g., Helicopter service"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeInclusion(index)}
                          disabled={inclusions.length === 1}
                        >
                          <Trash2 className={cn('w-4', 'h-4')} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addInclusion}
                      className="w-full"
                    >
                      <Plus className={cn('w-4', 'h-4', 'mr-2')} />
                      Add Inclusion
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Exclusions */}
              <Card>
                <CardHeader>
                  <CardTitle className={cn('flex', 'items-center', 'gap-2')}>
                    <AlertCircle className={cn('w-5', 'h-5', 'text-red-600')} />
                    Package Exclusions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exclusions.map((exclusion, index) => (
                      <div key={index} className={cn('flex', 'items-center', 'gap-3')}>
                        <input
                          type="text"
                          value={exclusion}
                          onChange={(e) => handleExclusionChange(index, e.target.value)}
                          className={cn('flex-1', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                          placeholder="e.g., Personal expenses"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeExclusion(index)}
                          disabled={exclusions.length === 1}
                        >
                          <Trash2 className={cn('w-4', 'h-4')} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addExclusion}
                      className="w-full"
                    >
                      <Plus className={cn('w-4', 'h-4', 'mr-2')} />
                      Add Exclusion
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Terms & Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={packageData.terms_conditions}
                    onChange={(e) => handleInputChange('terms_conditions', e.target.value)}
                    rows={6}
                    className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                    placeholder="Enter terms and conditions..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary">
            <Card>
              <CardHeader>
                <CardTitle className={cn('flex', 'items-center', 'gap-2')}>
                  <Calendar className={cn('w-5', 'h-5')} />
                  Package Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className={cn('border', 'border-gray-200', 'rounded-lg', 'p-4')}>
                      <div className={cn('flex', 'items-center', 'justify-between', 'mb-4')}>
                        <h3 className={cn('text-lg', 'font-semibold')}>Day {day.day}</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItineraryDay(dayIndex)}
                          disabled={itinerary.length === 1}
                        >
                          <Trash2 className={cn('w-4', 'h-4')} />
                        </Button>
                      </div>
                      
                      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4', 'mb-4')}>
                        <div>
                          <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                            Day Title
                          </label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => handleItineraryChange(dayIndex, 'title', e.target.value)}
                            className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                            placeholder="e.g., Jabalpur to Maihar VIP Darshan"
                          />
                        </div>
                        <div>
                          <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                            Duration
                          </label>
                          <input
                            type="text"
                            value={day.duration}
                            onChange={(e) => handleItineraryChange(dayIndex, 'duration', e.target.value)}
                            className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                            placeholder="e.g., 2 Hr 30 Min"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                          Activities
                        </label>
                        <div className="space-y-2">
                          {day.activities.map((activity, activityIndex) => (
                            <div key={activityIndex} className={cn('flex', 'items-center', 'gap-2')}>
                              <input
                                type="text"
                                value={activity}
                                onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                                className={cn('flex-1', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                                placeholder="e.g., Departure from Jabalpur"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeActivity(dayIndex, activityIndex)}
                                disabled={day.activities.length === 1}
                              >
                                <Trash2 className={cn('w-4', 'h-4')} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addActivity(dayIndex)}
                          >
                            <Plus className={cn('w-4', 'h-4', 'mr-2')} />
                            Add Activity
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItineraryDay}
                    className="w-full"
                  >
                    <Plus className={cn('w-4', 'h-4', 'mr-2')} />
                    Add Day
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <CardTitle className={cn('flex', 'items-center', 'gap-2')}>
                  <Plane className={cn('w-5', 'h-5')} />
                  Package Schedules
                </CardTitle>
                <p className={cn('text-sm', 'text-gray-600', 'mt-2')}>
                  Link helicopter schedules to this package. These will be automatically booked when customers book the package.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packageSchedules.map((schedule, index) => (
                    <div key={index} className={cn('border', 'border-gray-200', 'rounded-lg', 'p-4')}>
                      <div className={cn('flex', 'items-center', 'justify-between', 'mb-4')}>
                        <h3 className={cn('text-lg', 'font-semibold')}>Schedule {index + 1}</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSchedule(index)}
                          disabled={packageSchedules.length === 1}
                        >
                          <Trash2 className={cn('w-4', 'h-4')} />
                        </Button>
                      </div>
                      
                      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-4')}>
                        <div>
                          <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                            Schedule Type
                          </label>
                          <select
                            value={schedule.schedule_type}
                            onChange={(e) => handleScheduleChange(index, 'schedule_type', e.target.value)}
                            className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                          >
                            <option value="helicopter">Helicopter</option>
                            <option value="flight">Flight</option>
                          </select>
                        </div>

                        <div>
                          <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                            Schedule
                          </label>
                          <select
                            value={schedule.schedule_id}
                            onChange={(e) => handleScheduleChange(index, 'schedule_id', e.target.value)}
                            className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                          >
                            <option value="">Select Schedule</option>
                            {schedules.map((s) => (
                              <option key={s.id} value={s.id}>
                                {getScheduleDetails(s.id)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                            Day Number
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={schedule.day_number}
                            onChange={(e) => handleScheduleChange(index, 'day_number', parseInt(e.target.value))}
                            className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                          />
                        </div>

                        <div>
                          <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
                            Return Journey
                          </label>
                          <select
                            value={schedule.is_return}
                            onChange={(e) => handleScheduleChange(index, 'is_return', e.target.value === 'true')}
                            className={cn('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent')}
                          >
                            <option value={false}>Onward</option>
                            <option value={true}>Return</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSchedule}
                    className="w-full"
                  >
                    <Plus className={cn('w-4', 'h-4', 'mr-2')} />
                    Add Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className={cn('flex', 'justify-end', 'pt-6')}>
          <Button
            type="submit"
            disabled={loading}
            className={cn('bg-gradient-to-r', 'from-orange-600', 'to-red-600', 'hover:from-orange-700', 'hover:to-red-700', 'text-white', 'px-8', 'py-3')}
          >
            {loading ? (
              <>
                <Loader2 className={cn('w-4', 'h-4', 'mr-2', 'animate-spin')} />
                Creating Package...
              </>
            ) : (
              <>
                <Save className={cn('w-4', 'h-4', 'mr-2')} />
                Create Package
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddHolidayPackage;