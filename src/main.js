import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import createPinia
import App from './App.vue';

const app = createApp(App);

const pinia = createPinia(); // Create a Pinia instance
app.use(pinia); // Register Pinia with the app

app.mount('#app');