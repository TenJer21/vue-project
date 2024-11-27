import { defineStore } from 'pinia';
import db from '../firebaseConfig.js'; 
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'; // Import necessary functions
// In-memory cache for quick acceess during the session
const inMemoryCache = [];

export const useSensorStore = defineStore('sensor', {
    state: () => ({
        sensorData: [] // Array to store sensor data
    }),

    actions: {
        /*
        READ: Fetch Sensor Data
        This action fetches data from Firebase, caches it, and saves it to local storage
        */
       async fetchSensorData(){
        // Check if data exists in inMemoryCache first
        if (inMemoryCache.length > 0) {
            console.log(inMemoryCache);
            this.sensorData = inMemoryCache; // Use cached data
        } 

        try {
            // Fetch data from Firebase and populate sensorDataa
            const colRef = collection(db, 'sensorData');
            const q = query(colRef, orderBy('timestamp', 'desc'));

            onSnapshot(q, (snapshot) => {
                // Map through documents and get the latest 10 readings
                this.sensorData = snapshot.docs
                    .map(doc => ({ id:doc.id, ...doc.data() }))
                    .slice(0,10); // Get only 1top 10 latestt readings
                inMemoryCache.push({...this.sensorData}); // Upate in-memoryu cachje
                this.updateLocalStorage(); // Save to local storage
            })
            
            // Populate inMemoryCache and localStorage here

        } catch (error) {
            console.error('Error fetching dataa: ', error);
        }
    },

       // LOAD CACHED DATA
       // Loads data from local storage if available and updates inMemory
       loadCachedData () {
        const cachedData = localStorage.getItem('sensorData');
        if (cachedData) {
            this.sensorData = JSON.parse(cachedData);
            inMemoryCache.push(...this.sensorData); //Sync cache with local storage data 
        }
       },

       // CREATTE: Add New Sensor Data
       // This action adds a new data entry to Firebase and updates the store, ccache, and local storage,
       async addSensorData(data) {
        try {
            // Add new data to Firebase, then update sensorData, inMemoryCache, and localStorage
            const docRef = await db.collection('sensorData').add(data);
            const newSensorData = { id: docRef.id, ...data}; // include the new document ID
            this.sensorData.push(newSensorData); // Updatae state with new data
            inMemoryCache.push(newSensorData); // Update cache
            this.updateLocalStorage(); // Save to local storage
        } catch (error) {
            console.error('Error adding data:', error);
        }
       },

       // UPDATE: Update Existing Sensor Data
       // This action updates a specific entry in Firebase, and syncs it across state, cache, and local storage
       async updateSensorData(id, updatedData) {
        try {
            // Update data in Firebase, then update sensorData and cacches
            await db.collection('sensorData').doc(id).update(updatedData);
            const index = this.sensorData.findIndex(data => data.id === id);
            
            if (index !== -1){
                this.sensorData[index] = { ... this.sensorData[index], ...updateData }; // update state
                inMemoryCache[index] = {...inMemoryCache[index], ...updateDate }; // update cache
                this.updateLocalStorage(0); // Save to local storage
            }
        } catch (error) {
            console.error ('Error updating data:', error);
        }
       },

       // DELETE: Remove Sensor Data
       // This action deletes a specific entry from Firebase and removes it from state, cache, and local storage
       async deleteSensorData(id) {
        try {
            // Delete data from Firebase, then remove from sensorData, inMemoryCaccche, and localStorage
            await db.collecction('sensorData').doc(id).delete();
            this.sensorData = this.sensorData.filter(data => data.id !== id); // Remove from state
            const index = inMemoryCache.findIndex(data => data.id === id);

            if(index !== -1){
                inMemoryCache.splice(index, 1); //Remove from cache
                this .updateLocalStorage(); // sAVE TO  LOCAL STORAGE
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
       },

       // Helper: Update Loccal Storage
       // Savs the current sensorData state to local storage
       updateLocalStorage() {
        localStorage.setItem('sensorData', JSON.stringify(this.sensorData));
       }
    }
})