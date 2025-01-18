import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './config/router';
import { useAuthStore } from './stores/useAuthStore';
import './styles/reset.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.initializeAuth(); // Initialize auth store
app.mount('#app');
