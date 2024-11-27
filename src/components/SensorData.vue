<template>
    <div>
      <h1>Sensor Data</h1>
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
    methods: {
      formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
      },
    },
  };
  </script>
  