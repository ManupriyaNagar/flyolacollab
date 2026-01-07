'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from "@/lib/utils";
import {
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Mountain,
  Phone,
  Plane,
  Star,
  TreePine,
  Users,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

const HolidayPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/holiday-packages');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.data);
      } else {
        setError('Failed to fetch packages');
      }
    } catch (err) {
      setError('Error connecting to server. Please make sure the backend is running.');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
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

  const getPackageTypeColor = (type) => {
    switch (type) {
      case 'spiritual':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'wildlife':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'adventure':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cultural':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredPackages = selectedType === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.package_type === selectedType);

  const handleBookNow = (packageId) => {
    // For now, show an alert with package details and redirect to booking
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      alert(`🎉 Ready to book "${selectedPackage.title}"!\n\nPrice: ₹${selectedPackage.price_per_person.toLocaleString()} per person\nDuration: ${selectedPackage.duration_days} day${selectedPackage.duration_days > 1 ? 's' : ''}${selectedPackage.duration_nights > 0 ? ` / ${selectedPackage.duration_nights} night${selectedPackage.duration_nights > 1 ? 's' : ''}` : ''}\n\nBooking system integration coming soon!`);
    }
  };

  if (loading) {
    return (
      <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-indigo-100', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600">Loading holiday packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-indigo-100', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <XCircle className={cn('w-12', 'h-12', 'text-red-500', 'mx-auto', 'mb-4')} />
          <p className={cn('text-red-600', 'text-lg')}>{error}</p>
          <Button onClick={fetchPackages} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-indigo-100')}>
      {/* Header */}
      <div className={cn('bg-white', 'shadow-sm', 'border-b')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className="text-center">
            <h1 className={cn('text-4xl', 'font-bold', 'text-gray-900', 'mb-2')}>
              🛩️ Fly Ola Holiday Packages
            </h1>
            <p className={cn('text-lg', 'text-gray-600', 'max-w-2xl', 'mx-auto')}>
              Discover amazing destinations with our helicopter tour packages. 
              From spiritual journeys to wildlife adventures, we have something for everyone.
            </p>
          </div>
        </div>
      </div>

      <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8')}>
        {/* Filter Tabs */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-8">
          <TabsList className={cn('grid', 'w-full', 'grid-cols-5', 'lg:w-1/2', 'mx-auto')}>
            <TabsTrigger value="all">All Packages</TabsTrigger>
            <TabsTrigger value="spiritual">Spiritual</TabsTrigger>
            <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
            <TabsTrigger value="adventure">Adventure</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Packages Grid */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className={cn('overflow-hidden', 'hover:shadow-lg', 'transition-shadow', 'duration-300')}>
              <CardHeader className="pb-4">
                <div className={cn('flex', 'items-start', 'justify-between')}>
                  <div className="flex-1">
                    <CardTitle className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-2')}>
                      {pkg.title}
                    </CardTitle>
                    <Badge className={`${getPackageTypeColor(pkg.package_type)} mb-3`}>
                      <span className={cn('flex', 'items-center', 'gap-1')}>
                        {getPackageIcon(pkg.package_type)}
                        {pkg.package_type.charAt(0).toUpperCase() + pkg.package_type.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </div>
                
                <p className={cn('text-gray-600', 'text-sm', 'leading-relaxed')}>
                  {pkg.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Package Details */}
                <div className={cn('grid', 'grid-cols-2', 'gap-4', 'text-sm')}>
                  <div className={cn('flex', 'items-center', 'gap-2')}>
                    <Clock className={cn('w-4', 'h-4', 'text-blue-500')} />
                    <span>
                      {pkg.duration_days} Day{pkg.duration_days > 1 ? 's' : ''}
                      {pkg.duration_nights > 0 && ` / ${pkg.duration_nights} Night${pkg.duration_nights > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-2')}>
                    <Users className={cn('w-4', 'h-4', 'text-green-500')} />
                    <span>Max {pkg.max_passengers} passengers</span>
                  </div>
                </div>

                {/* Inclusions */}
                {pkg.inclusions && pkg.inclusions.length > 0 && (
                  <div>
                    <h4 className={cn('font-semibold', 'text-gray-900', 'mb-2', 'flex', 'items-center', 'gap-2')}>
                      <CheckCircle className={cn('w-4', 'h-4', 'text-green-500')} />
                      Inclusions
                    </h4>
                    <ul className={cn('text-sm', 'text-gray-600', 'space-y-1')}>
                      {pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                        <li key={index} className={cn('flex', 'items-start', 'gap-2')}>
                          <span className={cn('text-green-500', 'mt-1')}>•</span>
                          <span>{inclusion}</span>
                        </li>
                      ))}
                      {pkg.inclusions.length > 3 && (
                        <li className={cn('text-blue-600', 'font-medium')}>
                          +{pkg.inclusions.length - 3} more inclusions
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Itinerary Preview */}
                {pkg.itinerary && pkg.itinerary.length > 0 && (
                  <div>
                    <h4 className={cn('font-semibold', 'text-gray-900', 'mb-2', 'flex', 'items-center', 'gap-2')}>
                      <Calendar className={cn('w-4', 'h-4', 'text-blue-500')} />
                      Itinerary Highlights
                    </h4>
                    <div className={cn('text-sm', 'text-gray-600')}>
                      <div className={cn('bg-gray-50', 'rounded-lg', 'p-3')}>
                        <div className={cn('font-medium', 'text-gray-900')}>
                          Day 1: {pkg.itinerary[0].title}
                        </div>
                        <div className={cn('text-xs', 'text-gray-500', 'mt-1')}>
                          Duration: {pkg.itinerary[0].duration}
                        </div>
                      </div>
                      {pkg.itinerary.length > 1 && (
                        <div className={cn('text-center', 'text-blue-600', 'font-medium', 'mt-2')}>
                          +{pkg.itinerary.length - 1} more day{pkg.itinerary.length > 2 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Price and Book Button */}
                <div className={cn('border-t', 'pt-4')}>
                  <div className={cn('flex', 'items-center', 'justify-between')}>
                    <div>
                      <div className={cn('text-2xl', 'font-bold', 'text-green-600')}>
                        ₹{pkg.price_per_person.toLocaleString()}
                      </div>
                      <div className={cn('text-sm', 'text-gray-500')}>per person</div>
                    </div>
                    <Button 
                      onClick={() => handleBookNow(pkg.id)}
                      className={cn('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-6', 'py-2')}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className={cn('text-center', 'py-12')}>
            <div className={cn('text-gray-400', 'mb-4')}>
              <Plane className={cn('w-16', 'h-16', 'mx-auto')} />
            </div>
            <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-2')}>
              No packages found
            </h3>
            <p className="text-gray-600">
              {selectedType === 'all' 
                ? 'No holiday packages are currently available.' 
                : `No ${selectedType} packages are currently available.`}
            </p>
          </div>
        )}

        {/* Contact Information */}
        <div className={cn('mt-12', 'bg-white', 'rounded-lg', 'shadow-sm', 'p-6')}>
          <div className="text-center">
            <h3 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'mb-4')}>
              Need Help Planning Your Trip?
            </h3>
            <p className={cn('text-gray-600', 'mb-6')}>
              Our travel experts are here to help you customize your perfect holiday package.
            </p>
            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center', 'items-center')}>
              <div className={cn('flex', 'items-center', 'gap-2', 'text-blue-600')}>
                <Phone className={cn('w-5', 'h-5')} />
                <span className="font-semibold">+91 92121 70022</span>
              </div>
              <div className={cn('flex', 'items-center', 'gap-2', 'text-blue-600')}>
                <Phone className={cn('w-5', 'h-5')} />
                <span className="font-semibold">+91 88241 87048</span>
              </div>
              <div className={cn('flex', 'items-center', 'gap-2', 'text-blue-600')}>
                <Phone className={cn('w-5', 'h-5')} />
                <span className="font-semibold">+91 98705 00422</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayPackages;