import { createRouter, createWebHistory } from 'vue-router';
import About from '../pages/About.vue';
import Contacts from '../pages/Contacts.vue';
import Favorite from '../pages/Favorite.vue';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import NotFound from '../pages/NotFound.vue';
import Products from '../pages/Products.vue';
import Register from '../pages/Register.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/favorite', name: 'favorite', component: Favorite },
  { path: '/contacts', name: 'contacts', component: Contacts },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/products', name: 'products', component: Products },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
