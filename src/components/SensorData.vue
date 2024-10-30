<template>
    <div>
        <h1>Sensor Data</h1>
        <u1>
            <li v-for="data in sensorData" :key="data.id">
                Temperature: {{ data.temperature }} °C, Humidity: {{data.humidity}} %
            </li>
        </u1>
    </div>
</template>

<script>
import  db  from '../firebaseConfig.js'; 
import { collection, getDocs } from 'firebase/firestore'; // Import necessary functions

export default {
    data() {
        return {
            sensorData: [],
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const colRef = collection(db, 'sensorData'); // Create a reference to the collection
                const snapshot = await getDocs(colRef); // Get documents from the collection
                this.sensorData = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }));
            }
            catch (error) {
                console.error("Error fetchcing sensor data:", error);
            }
        },
    },
};

</script>

<style scoped>
div {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
    color: #333;
}

h1 {
    font-size: 2em;
    color: #0056b3;
    margin-bottom: 20px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    background-color: #f0f8ff;
    padding: 10px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 1.1em;
}

li:hover {
    background-color: #e6f2ff;
    cursor: pointer;
}

</style>