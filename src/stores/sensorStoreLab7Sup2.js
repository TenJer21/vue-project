// stores/sensorStore.js

import { defineStore } from 'pinia';
import db from '../firebaseConfig.js';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { saveToCache, loadFromCache } from '@/utils/cacheHelpers.js';

const CACHE_NAME = 'sensor-data-cache-v1';
const CACHE_KEY = 'sensorData';
const CACHE_URL = '/api/sensorData'; // Define a URL for the cached data

export const useSensorStore = defineStore('sensor', {
  state: () => ({
    sensorData: [],
  }),
  actions: {
    /**
     * Fetches sensor data from Firestore or cache.
     */
    async fetchSensorData() {
      if (!navigator.onLine) {
        console.warn('Offline: Loading data from cache');
        const cachedData = await loadFromCache(CACHE_NAME, CACHE_URL);
        if (cachedData) {
          this.sensorData = cachedData;
        } else {
          console.error('No cached data found.');
        }
        return;
      }

      try {
        const colRef = collection(db, 'sensorData');
        const q = query(colRef, orderBy('timestamp', 'desc'));

        onSnapshot(q, async (snapshot) => {
          console.log('onSnapshot triggered');
          const updatedData = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .slice(0, 10); // Limit to 10 entries

          this.sensorData = updatedData;

          // Save the data to the cache
          await saveToCache(CACHE_NAME, CACHE_URL, updatedData);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    /**
     * Loads cached data into the state.
     */
    async loadCachedData() {
      const cachedData = await loadFromCache(CACHE_NAME, CACHE_URL);
      if (cachedData) {
        this.sensorData = cachedData;
      } else {
        console.warn('No cached data found.');
      }
    },
  },
});
