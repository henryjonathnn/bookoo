// src/utils/imageHelper.js

/**
 * Helper function to handle image imports from assets directory
 * @param {string} imagePath - The path to the image relative to assets directory
 * @param {string} [directory=''] - Optional subdirectory within assets (e.g., 'books', 'authors')
 * @returns {string|null} The resolved image URL or null if not found
 */
export const getImagePath = (imagePath, directory = '') => {
    if (!imagePath) return null;
    
    try {
      // Remove leading slash if present
      const cleanPath = imagePath.replace(/^\//, '');
      
      // If the path already includes 'assets', strip it to avoid duplication
      const normalizedPath = cleanPath.replace(/^assets\//, '');
      
      // Combine directory and image path
      const fullPath = directory
        ? `${directory.replace(/^\//, '')}/${normalizedPath}`
        : normalizedPath;
  
      // Use dynamic import for images
      const imageUrl = new URL(`../assets/${fullPath}`, import.meta.url).href;
      return imageUrl;
    } catch (error) {
      console.error(`Failed to load image: ${imagePath}`, error);
      return null;
    }
  };