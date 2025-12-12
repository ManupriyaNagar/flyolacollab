"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaDownload, FaFileUpload, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ScheduleManagementPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || authState.userRole !== "1")) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  // Fetch current schedule
  useEffect(() => {
    if (authState.isLoggedIn && authState.userRole === "1") {
      fetchCurrentSchedule();
    }
  }, [authState]);

  const fetchCurrentSchedule = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/schedule-file/current`);
      const data = await response.json();
      setCurrentSchedule(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Failed to load current schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF and image files are allowed");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('scheduleFile', selectedFile);

      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/schedule-file/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      toast.success("Schedule file uploaded successfully!");
      setSelectedFile(null);
      fetchCurrentSchedule();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload schedule file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the current schedule file?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/schedule-file/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast.success("Schedule file deleted successfully!");
      fetchCurrentSchedule();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete schedule file");
    }
  };

  if (loading) {
    return (
      <div className={cn('flex', 'items-center', 'justify-center', 'min-h-screen')}>
        <div className={cn('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600')}></div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', 'p-6')}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div>
        <h1 className={cn('text-3xl', 'font-bold', 'text-slate-800', 'flex', 'items-center', 'gap-3')}>
          <div className={cn('p-2', 'bg-gradient-to-r', 'from-blue-500', 'to-indigo-500', 'rounded-xl')}>
            <FaCalendarAlt className={cn('w-8', 'h-8', 'text-white')} />
          </div>
          Schedule File Management
        </h1>
        <p className={cn('text-slate-600', 'mt-2')}>
          Upload and manage the flight schedule file that appears in the header download menu
        </p>
      </div>

      {/* Current Schedule Card */}
      <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
        <h2 className={cn('text-xl', 'font-semibold', 'text-slate-800', 'mb-4')}>Current Schedule File</h2>
        
        {currentSchedule && (
          <div className={cn('space-y-4')}>
            <div className={cn('flex', 'items-center', 'justify-between', 'p-4', 'bg-blue-50', 'rounded-lg', 'border', 'border-blue-200')}>
              <div>
                <p className={cn('font-medium', 'text-slate-800')}>
                  {currentSchedule.filename || 'schedule-final.pdf'}
                </p>
                {currentSchedule.uploadedAt && (
                  <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>
                    Uploaded: {new Date(currentSchedule.uploadedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className={cn('flex', 'gap-2')}>
                <a
                  href={`${BASE_URL}${currentSchedule.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
                >
                  <FaDownload className={cn('w-4', 'h-4')} />
                  Download
                </a>
                {currentSchedule.filename !== 'schedule-final.pdf' && (
                  <button
                    onClick={handleDelete}
                    className={cn('flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-red-600', 'text-white', 'rounded-lg', 'hover:bg-red-700', 'transition-colors')}
                  >
                    <FaTrash className={cn('w-4', 'h-4')} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload New Schedule Card */}
      <div className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'border', 'border-slate-200', 'p-6')}>
        <h2 className={cn('text-xl', 'font-semibold', 'text-slate-800', 'mb-4')}>Upload New Schedule</h2>
        
        <div className={cn('space-y-4')}>
          <div>
            <label className={cn('block', 'text-sm', 'font-medium', 'text-slate-700', 'mb-2')}>
              Select File (PDF or Image)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className={cn('block', 'w-full', 'text-sm', 'text-slate-500', 'file:mr-4', 'file:py-2', 'file:px-4', 'file:rounded-lg', 'file:border-0', 'file:text-sm', 'file:font-semibold', 'file:bg-blue-50', 'file:text-blue-700', 'hover:file:bg-blue-100', 'file:cursor-pointer')}
            />
            <p className={cn('text-xs', 'text-slate-500', 'mt-2')}>
              Maximum file size: 10MB. Supported formats: PDF, JPG, PNG
            </p>
          </div>

          {selectedFile && (
            <div className={cn('p-4', 'bg-green-50', 'rounded-lg', 'border', 'border-green-200')}>
              <p className={cn('text-sm', 'text-green-800')}>
                <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={cn(
              'flex', 'items-center', 'gap-2', 'px-6', 'py-3', 'rounded-lg', 'font-semibold', 'transition-colors',
              selectedFile && !uploading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            )}
          >
            <FaFileUpload className={cn('w-5', 'h-5')} />
            {uploading ? 'Uploading...' : 'Upload Schedule'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className={cn('bg-blue-50', 'rounded-2xl', 'border', 'border-blue-200', 'p-6')}>
        <h3 className={cn('text-lg', 'font-semibold', 'text-blue-900', 'mb-3')}>📋 Instructions</h3>
        <ul className={cn('space-y-2', 'text-sm', 'text-blue-800')}>
          <li>• Upload a PDF or image file containing the flight schedule</li>
          <li>• The file will be available for download in the website header under "Download → Schedule"</li>
          <li>• Uploading a new file will automatically replace the old one</li>
          <li>• Deleting the file will revert to the default schedule (schedule-final.pdf)</li>
          <li>• Maximum file size is 10MB</li>
        </ul>
      </div>
    </div>
  );
}
