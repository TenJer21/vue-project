<template>
    <div>
        <h1>Sensor Data</h1>
        <p>Current Time: {{ currentTime }}</p> <!-- Display the current time -->
        <ul>
            <li v-for="data in sensorData" :key="data.id">
                <strong>Temperature:</strong> {{ data.temperature }}°C <br>
                <strong>Humidity:</strong> {{ data.humidity }} %<br>
                <strong>Recorded at:</strong> {{ formatTimestamp(data.timestamp) }}
            </li>
        </ul>
    </div>
</template>


<script>
import { useSensorStore } from '@/stores/sensorStoreLab7Sup1.js';
import { onMounted } from 'vue';
import db from '../firebaseConfig.js'; 
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'; // Import necessary functions


export default {
    setup() {
        const sensorStore = useSensorStore();

        onMounted(() => {
            sensorStore.fetchSensorData()
        });

        return{
            sensorData: sensorStore.sensorData
        };
    },
    data() {
        return {
            currentTime: '', // New data property for current time
            
        };
    },
    created() {
        this.fetchData();
        this.updateTime(); // Call to set initial time
    },
    mounted() {
        setInterval(this.updateTime, 1000); // Update time every second
    },
    methods: {
        fetchData() {
            const colRef = collection(db, 'sensorData'); // Create a reference to the collection
            const q = query(colRef, orderBy('timestamp', 'desc')); // Query to order by timestamp

            // Listen for real-time updates
            onSnapshot(q, (snapshot) => {
                // Map through documents and get the latest 10 readings
                this.sensorData = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .slice(0, 10); // Get only the top 10 latest readings
            }, (error) => {
                console.error("Error fetching sensor data:", error);
            });
        },
        updateTime() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString(); // Format current time as a string
        },
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleString(); // Format timestamp as a readable string
        }
    },
};
</script>

<style scoped>
body {
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9; /* Light background */
    margin: 0;
    padding: 20px;
}

div {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background-color: #ffffff; /* White background */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333; /* Dark text */
    font-size: 2em;
    margin-bottom: 10px;
}

h2 {
    color: #333; /* Dark text */
    font-size: 0.75em;
    margin-bottom: 10px;
}
p {
    color: #555; /* Medium grey for paragraph */
    font-size: 1.1em;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    background-color: #e7f3fe; /* Light blue */
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    color: #000; /* Ensure text inside list items is black */
}

li:hover {
    background-color: #d1e7fd; /* Darker blue on hover */
}
</style>