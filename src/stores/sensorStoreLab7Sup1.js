import { defineStore } from 'pinia';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import db from '../firebaseConfig.js';

// In-memory cache
const inMemoryCache = [];

export const useSensorStore = defineStore('sensor', {
  state: () => ({
    sensorData: [], // Array to store sensor data
    isOffline: !navigator.onLine, // Track offline/online state
    unsubscribe: null, // For Firestore onSnapshot unsubscribe
  }),

  actions: {
    // Fetch data from Firestore
    async fetchSensorData() {
      if (inMemoryCache.length > 0) {
        this.sensorData = inMemoryCache; // Use in-memory cache if available
      } else {
        try {
            const colRef = collection(db, 'sensorData');
            const q = query(colRef, orderBy('timestamp', 'desc'));
    
            // Unsubscribe from any existing listener
            if (this.unsubscribe) {
              this.unsubscribe();
              this.unsubscribe = null;
            }
    
            // Set up Firestore listener
            this.unsubscribe = onSnapshot(
              q,
              (snapshot) => {
                console.log('onSnapshot triggered');
                const updatedData = snapshot.docs
                  .map((doc) => ({ id: doc.id, ...doc.data() }))
                  .slice(0, 10); // Limit to 10 entries
                
                if(updatedData.length){
                this.sensorData = updatedData; // Update state
                inMemoryCache.push(...updatedData); // Update cache
                this.updateLocalStorage(); // Sync to local storage
                }
              },
              (error) => {
                console.error('Firestore snapshot error:', error);
                if (error.code === 'unavailable' || error.code === 'failed-precondition') {
                  console.warn('Firestore unavailable. Using cached data.');
                  this.loadCachedData();
                }
              }
            );
          } catch (error) {
            console.error('Error fetching data:', error);
            this.loadCachedData(); // Fallback to cached data
          }
      }

      if (!navigator.onLine) {
        console.log('Offline mode: Using cached data.');
        this.loadCachedData();
        return;
      }

      
    },

    // Load cached data from local storage
    loadCachedData() {
      const cachedData = localStorage.getItem('sensorData');
      if (cachedData) {
        this.sensorData = JSON.parse(cachedData);
        console.info('Loaded data from cache.');
      } else {
        console.warn('No cached data found.');
      }
    },

    // Update local storage
    updateLocalStorage() {
      localStorage.setItem('sensorData', JSON.stringify(this.sensorData));
    },

    // Monitor online/offline status
    handleConnectivityChange() {
      this.isOffline = !navigator.onLine;

      if (this.isOffline) {
        console.warn('Now offline: Switching to cached data.');
        this.loadCachedData();
      } else {
        console.info('Now online: Fetching real-time data.');
        this.fetchSensorData();
      }
    },
  },

  // Lifecycle hooks for connectivity monitoring
  mounted() {
    window.addEventListener('online', this.handleConnectivityChange);
    window.addEventListener('offline', this.handleConnectivityChange);

    this.handleConnectivityChange(); // Set initial state
  },

  beforeDestroy() {
    window.removeEventListener('online', this.handleConnectivityChange);
    window.removeEventListener('offline', this.handleConnectivityChange);

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  },
});
