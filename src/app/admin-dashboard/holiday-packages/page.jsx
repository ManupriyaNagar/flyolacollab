'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import API from '@/services/api';
import {
    AlertCircle,
    Camera,
    Clock,
    DollarSign,
    Edit,
    Eye,
    Loader2,
    Mountain,
    Plane,
    Plus,
    Star,
    Trash2,
    TreePine,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HolidayPackagesManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await API.holidayPackages.getAllPackages();
      
      if (response.success) {
        setPackages(response.data);
      } else {
        setError('Failed to fetch packages');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
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

  const handleDeletePackage = async (packageId) => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }

    try {
      await API.holidayPackages.deletePackage(packageId);
      setPackages(packages.filter(pkg => pkg.id !== packageId));
    } catch (err) {
      alert('Failed to delete package: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className={cn('flex', 'items-center', 'justify-center', 'min-h-[400px]')}>
        <div className="text-center">
          <Loader2 className={cn('w-8', 'h-8', 'animate-spin', 'mx-auto', 'mb-4', 'text-blue-600')} />
          <p className="text-gray-600">Loading holiday packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex', 'items-center', 'justify-center', 'min-h-[400px]')}>
        <div className="text-center">
          <AlertCircle className={cn('w-12', 'h-12', 'text-red-500', 'mx-auto', 'mb-4')} />
          <p className={cn('text-red-600', 'text-lg', 'mb-4')}>{error}</p>
          <Button onClick={fetchPackages}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn('flex', 'items-center', 'justify-between')}>
        <div>
          <h1 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'flex', 'items-center', 'gap-3')}>
            <div className={cn('w-10', 'h-10', 'bg-gradient-to-r', 'from-blue-400', 'to-indigo-400', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
              <Plane className={cn('w-6', 'h-6', 'text-white')} />
            </div>
            Holiday Packages Management
          </h1>
          <p className={cn('text-gray-600', 'mt-2')}>Manage all holiday packages and their details</p>
        </div>
        <Link href="/admin-dashboard/add-holiday-package">
          <Button className={cn('bg-gradient-to-r', 'from-orange-600', 'to-red-600', 'hover:from-orange-700', 'hover:to-red-700', 'text-white')}>
            <Plus className={cn('w-4', 'h-4', 'mr-2')} />
            Add New Package
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6')}>
        <Card>
          <CardContent className="p-6">
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Total Packages</p>
                <p className={cn('text-2xl', 'font-bold', 'text-gray-900')}>{packages.length}</p>
              </div>
              <div className={cn('w-12', 'h-12', 'bg-blue-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
                <Plane className={cn('w-6', 'h-6', 'text-blue-600')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Spiritual</p>
                <p className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                  {packages.filter(p => p.package_type === 'spiritual').length}
                </p>
              </div>
              <div className={cn('w-12', 'h-12', 'bg-orange-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
                <Mountain className={cn('w-6', 'h-6', 'text-orange-600')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Wildlife</p>
                <p className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                  {packages.filter(p => p.package_type === 'wildlife').length}
                </p>
              </div>
              <div className={cn('w-12', 'h-12', 'bg-green-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
                <TreePine className={cn('w-6', 'h-6', 'text-green-600')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn('flex', 'items-center', 'justify-between')}>
              <div>
                <p className={cn('text-sm', 'font-medium', 'text-gray-600')}>Avg. Price</p>
                <p className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                  ₹{packages.length > 0 ? Math.round(packages.reduce((sum, p) => sum + p.price_per_person, 0) / packages.length).toLocaleString() : '0'}
                </p>
              </div>
              <div className={cn('w-12', 'h-12', 'bg-green-100', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
                <DollarSign className={cn('w-6', 'h-6', 'text-green-600')} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-6">
          <div className={cn('flex', 'flex-wrap', 'gap-2')}>
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              size="sm"
            >
              All Packages ({packages.length})
            </Button>
            <Button
              variant={selectedType === 'spiritual' ? 'default' : 'outline'}
              onClick={() => setSelectedType('spiritual')}
              size="sm"
            >
              <Mountain className={cn('w-4', 'h-4', 'mr-1')} />
              Spiritual ({packages.filter(p => p.package_type === 'spiritual').length})
            </Button>
            <Button
              variant={selectedType === 'wildlife' ? 'default' : 'outline'}
              onClick={() => setSelectedType('wildlife')}
              size="sm"
            >
              <TreePine className={cn('w-4', 'h-4', 'mr-1')} />
              Wildlife ({packages.filter(p => p.package_type === 'wildlife').length})
            </Button>
            <Button
              variant={selectedType === 'adventure' ? 'default' : 'outline'}
              onClick={() => setSelectedType('adventure')}
              size="sm"
            >
              <Camera className={cn('w-4', 'h-4', 'mr-1')} />
              Adventure ({packages.filter(p => p.package_type === 'adventure').length})
            </Button>
            <Button
              variant={selectedType === 'cultural' ? 'default' : 'outline'}
              onClick={() => setSelectedType('cultural')}
              size="sm"
            >
              <Star className={cn('w-4', 'h-4', 'mr-1')} />
              Cultural ({packages.filter(p => p.package_type === 'cultural').length})
            </Button>
          </div>
        </CardContent>
      </Card>

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
                <Badge variant={pkg.status === 1 ? 'default' : 'secondary'}>
                  {pkg.status === 1 ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <p className={cn('text-gray-600', 'text-sm', 'leading-relaxed', 'line-clamp-3')}>
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
                  <span>Max {pkg.max_passengers}</span>
                </div>
              </div>

              {/* Price */}
              <div className={cn('border-t', 'pt-4')}>
                <div className={cn('flex', 'items-center', 'justify-between', 'mb-4')}>
                  <div>
                    <div className={cn('text-2xl', 'font-bold', 'text-green-600')}>
                      ₹{pkg.price_per_person.toLocaleString()}
                    </div>
                    <div className={cn('text-sm', 'text-gray-500')}>per person</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={cn('flex', 'gap-2')}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`/holiday-packages`, '_blank')}
                  >
                    <Eye className={cn('w-4', 'h-4', 'mr-1')} />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => alert('Edit functionality coming soon!')}
                  >
                    <Edit className={cn('w-4', 'h-4', 'mr-1')} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn('text-red-600', 'hover:text-red-700', 'hover:bg-red-50')}
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    <Trash2 className={cn('w-4', 'h-4')} />
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
          <p className={cn('text-gray-600', 'mb-4')}>
            {selectedType === 'all' 
              ? 'No holiday packages have been created yet.' 
              : `No ${selectedType} packages are currently available.`}
          </p>
          <Link href="/admin-dashboard/add-holiday-package">
            <Button>
              <Plus className={cn('w-4', 'h-4', 'mr-2')} />
              Create Your First Package
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HolidayPackagesManagement;