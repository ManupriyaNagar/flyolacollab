/**
 * Temporary Image Upload - Stores images as base64
 * Use this ONLY for testing. For production, use Cloudinary!
 */

export const uploadToCloudinary = async (file, options = {}) => {
  const {
    isMain = false,
    caption = '',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // Convert to base64
      const base64 = e.target.result;
      
      resolve({
        url: base64, // Base64 data URL
        publicId: `temp_${Date.now()}`,
        width: 800,
        height: 600,
        format: 'base64',
        isMain,
        caption,
      });
    };
    
    reader.onerror = (error) => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

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

export const getThumbnailUrl = (url) => url;
export const getOptimizedImageUrl = (url) => url;
export const deleteFromCloudinary = async () => ({ success: true });

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  validateImageFile,
  getThumbnailUrl,
};
