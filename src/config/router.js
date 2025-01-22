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

// Navigation guard for protected routes
import { getCurrentUser, isAuthenticated } from '@/services/authServices';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/favorite', name: 'favorite', component: Favorite, meta: { requiresAuth: true } },
  { path: '/contacts', name: 'contacts', component: Contacts },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/products', name: 'products', component: Products },
  { path: '/unauthorized', name: 'Unauthorized', component: () => import('../pages/Unauthorized.vue') },
  { path: '/users', name: 'users', component: Users, meta: { requiresAuth: true } },
  { path: '/details/:id', name: 'details', component: Details, meta: { requiresAuth: true } },
  {
    path: '/admin',
    name: 'Admin',
    meta: { requiresAdmin: true }, // Admin-specific meta
    component: () => import('@/layouts/AdminLayout.vue'), // Admin layout
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/AdminDashboard.vue'),
      },
      {
        path: 'manage-users',
        name: 'ManageUsers',
        component: () => import('@/pages/admin/ManageUsers.vue'),
      },
      // Add more admin routes here
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach(async (to, from, next) => {
  try {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    if (requiresAuth || requiresAdmin) {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        return next({ name: 'login' }); // Redirect to login if not authenticated
      }

      if (requiresAdmin) {
        const user = await getCurrentUser();
        console.log('Authenticated User:', user);

        // Check if the user has the Admin role
        if (user.roles && user.roles.includes('Admin')) {
          return next(); // Allow admin access
        }
        else {
          return next({ name: 'Unauthorized' }); // Redirect non-admin users
        }
      }
    }

    next(); // Allow navigation for other routes
  }
  catch (error) {
    console.error('Navigation Guard Error:', error);
    next({ name: 'login' }); // Redirect to login on error
  }
});

export default router;
