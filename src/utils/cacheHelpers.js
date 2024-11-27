// utils/cacheHelpers.js

/**
 * Saves data to the cache.
 * @param {string} cacheName - The name of the cache.
 * @param {string} requestUrl - The URL of the request. 
 * @param {Object} data - The data to be cached.
 */
async function saveToCache(cacheName, requestUrl, data) {
    try {
      const cache = await caches.open(cacheName);
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put(requestUrl, response);
      console.log(`Data saved to cache: ${requestUrl}`);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }
  
  /**
   * Loads data from the cache.
   * @param {string} cacheName - The name of the cache.
   * @param {string} requestUrl - The URL of the request.
   * @returns {Promise<Object|null>} - The cached data or null if not found.
   */
  async function loadFromCache(cacheName, requestUrl) {
    try {
      const cache = await caches.open(cacheName);
      const response = await cache.match(requestUrl);
      if (response) {
        const data = await response.json();
        console.log(`Data loaded from cache: ${requestUrl}`);
        return data;
      }
      return null; // No cache match found
    } catch (error) {
      console.error('Error loading from cache:', error);
      return null;
    }
  }
  
  export { saveToCache, loadFromCache };
  