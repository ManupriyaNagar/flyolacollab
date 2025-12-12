"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useEffect, useState } from "react";
import { useAuth } from "./../../../components/AuthContext";

const UserProfile = () => {
  const { authState } = useAuth();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    gender: "",
    marital_status: "",
    anniversary_date: "",
    nationality: "",
    city: "",
    state: "",
    profile_picture: "",
    pan_card_number: "",
    email: "",
    number: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  useEffect(() => {
    if (!authState.isLoggedIn && !authState.isLoading) {
      setError("Please log in to view your profile.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.status === 404) {
          // Profile endpoint doesn't exist, use empty profile
          setLoading(false);
          return;
        }
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch profile`);
        }
        
        const data = await res.json();
        if (data.profile) {
          setProfile({
            ...data.profile,
            dob: data.profile.dob ? data.profile.dob.split("T")[0] : "",
            anniversary_date: data.profile.anniversary_date
              ? data.profile.anniversary_date.split("T")[0]
              : "",
          });
        } else if (data.user) {
          // Handle different response structure
          setProfile({
            ...data.user,
            dob: data.user.dob ? data.user.dob.split("T")[0] : "",
            anniversary_date: data.user.anniversary_date
              ? data.user.anniversary_date.split("T")[0]
              : "",
          });
        } else {
        }
      } catch (e) {
        if (e.message.includes('fetch')) {
          setError("Unable to connect to server. Please check your internet connection.");
        } else {
          setError(`Profile loading failed: ${e.message}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token, authState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("No authentication token found.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      
      if (res.status === 404) {
        // Profile endpoint doesn't exist
        setError("Profile update feature is not available yet. Please contact support.");
        setSaving(false);
        return;
      }
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}: Failed to save profile`);
      }
      
      const data = await res.json();
      setSuccess("Profile saved successfully!");
      
      // Update local profile with response data if available
      if (data.profile) {
        setProfile(prev => ({
          ...prev,
          ...data.profile,
          dob: data.profile.dob ? data.profile.dob.split("T")[0] : prev.dob,
          anniversary_date: data.profile.anniversary_date
            ? data.profile.anniversary_date.split("T")[0]
            : prev.anniversary_date,
        }));
      }
    } catch (e) {
      if (e.message.includes('fetch')) {
        setError("Unable to connect to server. Please check your internet connection.");
      } else {
        setError(`Save failed: ${e.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("No authentication token found.");
      setDeleting(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}: Failed to delete account`);
      }

      const data = await res.json();
      
      // Clear local storage and redirect to home page
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Show success message briefly before redirect
      setSuccess("Account deleted successfully. Redirecting...");
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      
    } catch (e) {
      if (e.message.includes('fetch')) {
        setError("Unable to connect to server. Please check your internet connection.");
      } else {
        setError(`Delete failed: ${e.message}`);
      }
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };


  if (loading) return (
    <div className="space-y-6">
      {/* Profile Header Skeleton */}
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Profile Form Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
          <div className="flex gap-4 pt-4">
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Profile</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              {error.includes("fetch") || error.includes("connect") ? (
                <button
                  onClick={() => {
                    setRetryCount(prev => prev + 1);
                    setError(null);
                    const fetchProfile = async () => {
                      setLoading(true);
                      setError(null);
                      try {
                        const res = await fetch(`${BASE_URL}/users/profile`, {
                          method: "GET",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                        });
                        
                        if (res.status === 404) {
                          setLoading(false);
                          return;
                        }
                        
                        if (!res.ok) {
                          const errorData = await res.json().catch(() => ({}));
                          throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch profile`);
                        }
                        
                        const data = await res.json();
                        if (data.profile) {
                          setProfile({
                            ...data.profile,
                            dob: data.profile.dob ? data.profile.dob.split("T")[0] : "",
                            anniversary_date: data.profile.anniversary_date
                              ? data.profile.anniversary_date.split("T")[0]
                              : "",
                          });
                        } else if (data.user) {
                          setProfile({
                            ...data.user,
                            dob: data.user.dob ? data.user.dob.split("T")[0] : "",
                            anniversary_date: data.user.anniversary_date
                              ? data.user.anniversary_date.split("T")[0]
                              : "",
                          });
                        } else {
                        }
                      } catch (e) {
                        if (e.message.includes('fetch')) {
                          setError("Unable to connect to server. Please check your internet connection.");
                        } else {
                          setError(`Profile loading failed: ${e.message}`);
                        }
                      } finally {
                        setLoading(false);
                      }
                    };
                    fetchProfile();
                  }}
                  className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              ) : null}
            </div>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex justify-center mb-6">
          {profile.profile_picture ? (
            <img
              src={profile.profile_picture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

     

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              placeholder="Full Name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={profile.dob || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
            <select
              name="marital_status"
              value={profile.marital_status || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Anniversary Date</label>
            <input
              type="date"
              name="anniversary_date"
              value={profile.anniversary_date || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={profile.nationality || ""}
              onChange={handleChange}
              placeholder="Nationality"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={profile.state || ""}
              onChange={handleChange}
              placeholder="State"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
            <input
              type="text"
              name="profile_picture"
              value={profile.profile_picture || ""}
              onChange={handleChange}
              placeholder="http://..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">PAN Card Number</label>
            <input
              type="text"
              name="pan_card_number"
              value={profile.pan_card_number || ""}
              onChange={handleChange}
              placeholder="PAN Card Number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              placeholder="Email"
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 cursor-not-allowed p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="number"
              value={profile.number || ""}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
              saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className={`w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors mt-4 ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Delete Account
          </button>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Delete Account
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone. 
                All your data will be permanently removed.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className={`flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors ${
                    deleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;