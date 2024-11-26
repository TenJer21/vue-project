import { defineStore } from 'pinia';
import db from '../firebaseConfig'; // Import Firebase config

export const useSensorStore = defineStore('sensor', {
    state: () => ({
        sensorData: [] //Array to store sensor data entries
    }),

    actions: {
        async fetchSensorData() {
            try {
                const snapshot = await db.collection('sensorData').get();
                this.sensorData  = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }));
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        }
    }
});