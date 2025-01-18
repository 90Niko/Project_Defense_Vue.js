import { createRouter, createWebHistory } from 'vue-router';
import About from '../pages/About.vue';
import Contacts from '../pages/Contacts.vue';
import Details from '../pages/Details.vue';
import Favorite from '../pages/Favorite.vue';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import NotFound from '../pages/NotFound.vue';
import Products from '../pages/Products.vue';
import Register from '../pages/Register.vue';
import Users from '../pages/Users.vue';
import { isAuthenticated } from '../services/authServices';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/favorite', name: 'favorite', component: Favorite, meta: { requiresAuth: true } },
  { path: '/contacts', name: 'contacts', component: Contacts },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/products', name: 'products', component: Products },
  { path: '/users', name: 'users', component: Users, meta: { requiresAuth: true } },
  { path: '/details/:id', name: 'details', component: Details, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ name: 'login' }); // Redirect to login page
    }
    else {
      next(); // Allow access
    }
  }
  else {
    next(); // Allow access to non-protected routes
  }
});

export default router;
