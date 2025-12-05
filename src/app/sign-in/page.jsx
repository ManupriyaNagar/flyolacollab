/**
 * SignInPage Component
 *
 * This file implements the sign-in page for the Flyola (Jet Serve Aviation) web application.
 *
 * Features:
 * - User authentication form with email and password fields
 * - Client-side validation for email and password
 * - Secure login with support for "Remember Me" (localStorage/sessionStorage)
 * - Integration with AuthContext for authentication state management
 * - Redirects users based on authentication status and role (admin/user)
 * - Displays error and success notifications using react-toastify
 * - Responsive, modern UI with Tailwind CSS and Heroicons
 * - Links to sign-up and forgot password pages
 * - Highlights premium aviation services and trust indicators
 *
 * Dependencies:
 * - React, Next.js, Tailwind CSS, Heroicons, react-toastify
 * - Custom API service and AuthContext
 *
 * Usage:
 * This component is used as the main sign-in page at /sign-in route.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import API from '@/services/api';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const { login, authState } = useAuth();
  const router = useRouter();

  // Get returnUrl from query parameters
  const [returnUrl, setReturnUrl] = useState(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const url = params.get('returnUrl');
      if (url) {
        setReturnUrl(decodeURIComponent(url));
      }
    }
  }, []);

  // Helper function to get redirect path based on user role
  const getRedirectPath = (role) => {
    // If there's a returnUrl, use it instead of role-based redirect
    if (returnUrl) {
      return returnUrl;
    }
    
    switch (role) {
      case '1': return '/admin-dashboard';
      case '2': return '/agent-dashboard';
      case '3': return '/';
      case '4': return '/head-admin-dashboard';
      case '5': return '/chairman-admin-dashboard';
      case '6': return '/operations-dashboard';
      case '7': return '/accounts-admin-dashboard';
      case '8': return '/mp-tourism-portal';
      default: return '/';
    }
  };

  // Redirect if already logged in (only when user directly visits sign-in page)
  useEffect(() => {
    if (authState.isLoggedIn && !authState.isLoading) {
      // Only redirect if user directly navigated to sign-in page, not from auth errors
      const redirectTo = getRedirectPath(authState.userRole);
      router.push(redirectTo);
    }
  }, [authState.isLoggedIn, authState.userRole, authState.isLoading, router, returnUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const data = await API.auth.login({
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userData', JSON.stringify(data.user));
      }

      // Update auth context
      login(data.token, data.user);

      toast.success('Welcome back! Redirecting...');

      // Redirect based on user role
      setTimeout(() => {
        const redirectTo = getRedirectPath(String(data.user.role));
        router.push(redirectTo);
      }, 1500);
    } catch (error) {
      const message = API.isApiError(error) ? error.message : 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-indigo-300 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 border-2 border-purple-300 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 border-2 border-blue-300 rounded-full"></div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-white to-indigo-50 rounded-2xl flex items-center justify-center  transform group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logoo-04.png"
                  alt="Flyola Logo"
                  className="w-16 h-8 object-contain"
                />
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Sign in to your Jet Serve Aviation account
          </p>
          <p className="text-sm text-gray-500">
            Experience premium aviation services with luxury and comfort
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Secure Login</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <LockClosedIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Protected Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Premium Service</span>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.password
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Sign In to Flyola
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-3">
            New to Jet Serve Aviation?
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Create Your Account
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
          <p className="text-xs text-gray-500 mt-3">
            Join thousands of satisfied customers who trust us with their aviation needs
          </p>
        </div>

        {/* Premium Features */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Premium Aviation Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <PaperAirplaneIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Private Charter</h4>
                <p className="text-xs text-gray-600 mt-1">Luxury private jet services for business and leisure</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Joy Rides</h4>
                <p className="text-xs text-gray-600 mt-1">Scenic helicopter tours and aerial experiences</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Safety First</h4>
                <p className="text-xs text-gray-600 mt-1">Certified pilots and maintained aircraft fleet</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">24/7 Support</h4>
                <p className="text-xs text-gray-600 mt-1">Round-the-clock customer service and assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;