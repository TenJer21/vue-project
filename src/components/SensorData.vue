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
  