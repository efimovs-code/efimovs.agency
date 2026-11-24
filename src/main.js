import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import router from './router';

// --- INITIALIZE & MOUNT VUE APPLICATION
const app = createApp(App);

app.use(router);
app.mount('#app');