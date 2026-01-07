/**
 * Cloudinary Image Upload Utility
 * Handles image uploads to Cloudinary for hotel images
 */

const CLOUDINARY_CONFIG = {
  cloudName: 'dlp7nsmtk',
  apiKey: '122468294237676',
  uploadPreset: 'hotel_images', // You'll need to create this preset in Cloudinary
};

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result with URL
 */
export const uploadToCloudinary = async (file, options = {}) => {
  const {
    folder = 'hotels',
    isMain = false,
    caption = '',
  } = options;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'hotel_images'); // Must create this preset in Cloudinary
    formData.append('folder', folder);
    
    // Add tags
    const tags = ['hotel'];
    if (isMain) tags.push('main');
    formData.append('tags', tags.join(','));

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      isMain,
      caption,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    // Note: Deletion requires server-side implementation with API secret
    // This is a placeholder - implement on backend
    console.warn('Image deletion should be handled on the backend');
    return { success: true };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Get optimized image URL
 * @param {string} url - Original Cloudinary URL
 * @param {Object} transformations - Image transformations
 * @returns {string} - Optimized URL
 */
export const getOptimizedImageUrl = (url, transformations = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto',
  } = transformations;

  // Extract parts of URL
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  // Build transformation string
  const transforms = `w_${width},h_${height},c_fill,q_${quality},f_${format}`;

  return `${parts[0]}/upload/${transforms}/${parts[1]}`;
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} - Validation result
 */
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit.',
    };
  }

  return { valid: true };
};

/**
 * Generate thumbnail URL
 * @param {string} url - Original image URL
 * @returns {string} - Thumbnail URL
 */
export const getThumbnailUrl = (url) => {
  return getOptimizedImageUrl(url, {
    width: 200,
    height: 150,
    quality: 'auto',
    format: 'auto',
  });
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  validateImageFile,
  getThumbnailUrl,
  config: CLOUDINARY_CONFIG,
};
