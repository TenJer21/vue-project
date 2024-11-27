<template>
    <div>
      <h1>Sensor Data</h1>
      <p v-if="isOffline" class="warning">You are offline. Displaying cached data.</p>
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
  import { useSensorStore } from '@/stores/sensorStoreLab7Sup1.js';
  import { computed, onMounted } from 'vue';
  
  export default {
    setup() {
      const sensorStore = useSensorStore();
  
      // Load data on component mount
      sensorStore.loadCachedData();
      
      onMounted(() => {
        sensorStore.fetchSensorData();
      });
  
      return {
        sensorData: computed(() => sensorStore.sensorData),
        isOffline: computed(() => sensorStore.isOffline),
      };
    },
    methods: {
      formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
      },
    },
  };
  </script>
  
  <style scoped>
  .warning {
    color: red;
    font-weight: bold;
  }
  
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    margin: 0;
    padding: 20px;
  }
  
  div {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    color: #333;
    font-size: 2em;
    margin-bottom: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    background-color: #f62fc4;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    color: #000;
  }
  
  li:hover {
    background-color: #d1e7fd;
  }
  </style>
  