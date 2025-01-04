import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './config/router';
import './styles/reset.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
