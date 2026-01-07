/**
 * Image Upload Component for Hotel Management
 * Supports main image and additional images with Cloudinary integration
 */

"use client";

import { cn } from "@/lib/utils";
import { uploadToCloudinary, validateImageFile } from "@/utils/cloudinary";
import { useState } from "react";
import { FaCamera, FaImage, FaPlus, FaTrash, FaUpload } from "react-icons/fa";

export default function HotelImageUpload({ images = [], onImagesChange, maxImages = 6 }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Ensure images is always an array
  const imagesArray = (() => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Failed to parse images:', e);
        return [];
      }
    }
    return [];
  })();

  const handleFileSelect = async (event, isMain = false) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check if we've reached max images
    if (imagesArray.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Update progress
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 0
        }));

        try {
          // Upload to Cloudinary
          const result = await uploadToCloudinary(file, {
            folder: 'hotels',
            isMain: isMain && index === 0,
            caption: isMain && index === 0 ? 'Main Image' : `Image ${imagesArray.length + index + 1}`
          });

          // Update progress
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100
          }));

          return {
            url: result.url,
            publicId: result.publicId,
            isMain: isMain && index === 0,
            caption: result.caption,
            order: imagesArray.length + index
          };
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          throw error;
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // If uploading a new main image, mark all existing images as not main
      let updatedImages = [...imagesArray];
      if (isMain && uploadedImages.length > 0) {
        updatedImages = updatedImages.map(img => ({ ...img, isMain: false }));
      }

      // Add new images
      const newImages = [...updatedImages, ...uploadedImages];
      onImagesChange(newImages);

      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress({});
      }, 1000);

    } catch (error) {
      alert(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = imagesArray.filter((_, i) => i !== index);
    
    // If we removed the main image, make the first image the main one
    if (imagesArray[index].isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }

    onImagesChange(newImages);
  };

  const handleSetAsMain = (index) => {
    const newImages = imagesArray.map((img, i) => ({
      ...img,
      isMain: i === index
    }));
    onImagesChange(newImages);
  };

  const mainImage = imagesArray.find(img => img.isMain);
  const additionalImages = imagesArray.filter(img => !img.isMain);

  return (
    <div className="space-y-4">
      {/* Main Image Section */}
      <div>
        <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
          <FaCamera className="inline mr-2" />
          Main Hotel Image *
        </label>
        
        {mainImage ? (
          <div className="relative group">
            <img
              src={mainImage.url}
              alt="Main hotel image"
              className={cn('w-full', 'h-64', 'object-cover', 'rounded-lg', 'border-2', 'border-blue-500')}
            />
            <div className={cn('absolute', 'inset-0', 'bg-black', 'bg-opacity-0', 'group-hover:bg-opacity-50', 'transition-all', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'gap-2')}>
              <label className={cn('opacity-0', 'group-hover:opacity-100', 'bg-blue-600', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'cursor-pointer', 'hover:bg-blue-700', 'transition-all', 'flex', 'items-center', 'gap-2')}>
                <FaUpload />
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, true)}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <button
                onClick={() => handleRemoveImage(imagesArray.findIndex(img => img.isMain))}
                className={cn('opacity-0', 'group-hover:opacity-100', 'bg-red-600', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-red-700', 'transition-all', 'flex', 'items-center', 'gap-2')}
              >
                <FaTrash />
                Remove
              </button>
            </div>
            <div className={cn('absolute', 'top-2', 'left-2', 'bg-blue-600', 'text-white', 'px-2', 'py-1', 'rounded', 'text-xs', 'font-semibold')}>
              Main Image
            </div>
          </div>
        ) : (
          <label className={cn('w-full', 'h-64', 'border-2', 'border-dashed', 'border-gray-300', 'rounded-lg', 'flex', 'flex-col', 'items-center', 'justify-center', 'cursor-pointer', 'hover:border-blue-500', 'hover:bg-blue-50', 'transition-all', 'group')}>
            <FaImage className={cn('text-gray-400', 'text-5xl', 'mb-3', 'group-hover:text-blue-500')} />
            <span className={cn('text-gray-600', 'font-medium', 'group-hover:text-blue-600')}>
              Click to upload main image
            </span>
            <span className={cn('text-gray-400', 'text-sm', 'mt-1')}>
              PNG, JPG, WebP up to 5MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, true)}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Additional Images Section */}
      <div>
        <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
          <FaImage className="inline mr-2" />
          Additional Images ({additionalImages.length}/{maxImages - 1})
        </label>
        
        <div className={cn('grid', 'grid-cols-2', 'md:grid-cols-3', 'gap-4')}>
          {additionalImages.map((image, index) => {
            const actualIndex = imagesArray.findIndex(img => img === image);
            return (
              <div key={actualIndex} className="relative group">
                <img
                  src={image.url}
                  alt={`Hotel image ${index + 1}`}
                  className={cn('w-full', 'h-32', 'object-cover', 'rounded-lg', 'border', 'border-gray-300')}
                />
                <div className={cn('absolute', 'inset-0', 'bg-black', 'bg-opacity-0', 'group-hover:bg-opacity-50', 'transition-all', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'gap-2')}>
                  <button
                    onClick={() => handleSetAsMain(actualIndex)}
                    className={cn('opacity-0', 'group-hover:opacity-100', 'bg-blue-600', 'text-white', 'p-2', 'rounded', 'hover:bg-blue-700', 'transition-all', 'text-xs')}
                    title="Set as main"
                  >
                    <FaCamera />
                  </button>
                  <button
                    onClick={() => handleRemoveImage(actualIndex)}
                    className={cn('opacity-0', 'group-hover:opacity-100', 'bg-red-600', 'text-white', 'p-2', 'rounded', 'hover:bg-red-700', 'transition-all')}
                    title="Remove"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* Add More Button */}
          {imagesArray.length < maxImages && (
            <label className={cn('w-full', 'h-32', 'border-2', 'border-dashed', 'border-gray-300', 'rounded-lg', 'flex', 'flex-col', 'items-center', 'justify-center', 'cursor-pointer', 'hover:border-blue-500', 'hover:bg-blue-50', 'transition-all', 'group')}>
              <FaPlus className={cn('text-gray-400', 'text-2xl', 'mb-2', 'group-hover:text-blue-500')} />
              <span className={cn('text-gray-600', 'text-sm', 'group-hover:text-blue-600')}>
                Add Image
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(e, false)}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className={cn('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-4')}>
          <p className={cn('text-sm', 'font-medium', 'text-blue-900', 'mb-2')}>Uploading images...</p>
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="mb-2">
              <div className={cn('flex', 'justify-between', 'text-xs', 'text-blue-700', 'mb-1')}>
                <span>{filename}</span>
                <span>{progress}%</span>
              </div>
              <div className={cn('w-full', 'bg-blue-200', 'rounded-full', 'h-2')}>
                <div
                  className={cn('bg-blue-600', 'h-2', 'rounded-full', 'transition-all')}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <p className={cn('text-xs', 'text-gray-500')}>
        <strong>Tip:</strong> Upload a main image and up to {maxImages - 1} additional images. 
        Click on any additional image to set it as the main image.
      </p>
    </div>
  );
}
