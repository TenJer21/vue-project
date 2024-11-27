<template>
    <div>
      <h1>Sensor Data</h1>
      <p>Current Time: {{ currentTime }}</p> <!-- Display the current time -->
      <ul>
        <li v-for="data in sensorData" :key="data.id">
          <strong>Temperature:</strong> {{ data.temperature }}°C <br />
          <strong>Humidity:</strong> {{ data.humidity }}% <br />
          <strong>Recorded at:</strong> {{ formatTimestamp(data.timestamp) }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { useSensorStore } from '@/stores/sensorStoreLab7Sup2.js';
  import { onMounted } from 'vue';
  import { computed } from 'vue';
  
  export default {
    setup() {
      const sensorStore = useSensorStore();
  
      // Load cached data on initialization
      onMounted(async () => {
        await sensorStore.loadCachedData();
        sensorStore.fetchSensorData();
      });
  
      return {
        sensorData: computed(() => sensorStore.sensorData),
      };
    },
    data(){
        return{
            currentTime:'', 
        };
    },
    created(){
        this.updateTime();
    },
    mounted(){
        setInterval(this.updateTime, 1000);
    },
    methods: {
        updateTime() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString(); // Format current time as a string
        },
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleString();
        },
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
      background-color: #c357ee; /* White background */
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
      color: #ffffff; /* Dark text */
      font-size: 2em;
      margin-bottom: 10px;
  }
  
  h2 {
      color: #ffffff; /* Dark text */
      font-size: 0.75em;
      margin-bottom: 10px;
  }
  p {
      color: #ffffff; /* Medium grey for paragraph */
      font-size: 1.1em;
  }
  
  ul {
      list-style-type: none;
      padding: 0;
  }
  
  li {
      background-color: #e0b7fc; /* Light blue */
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 10px;
      color: #000; /* Ensure text inside list items is black */
  }
  
  li:hover {
      background-color: #d1e7fd; /* Darker blue on hover */
  }
  </style>