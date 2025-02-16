import { createRouter, createWebHistory } from 'vue-router';

// Import Components
import About from '../pages/About.vue';
import Address from '../pages/Address.vue';
import Cart from '../pages/Cart.vue';
import Contacts from '../pages/Contacts.vue';
import Details from '../pages/Details.vue';
import Favorite from '../pages/Favorite.vue';
import Home from '../pages/Home.vue';
import Inbox from '../pages/Inbox.vue';
import Login from '../pages/Login.vue';
import NotFound from '../pages/NotFound.vue';
import Products from '../pages/Products.vue';
import Register from '../pages/Register.vue';

// Navigation Guard for Protected Routes
import { getCurrentUser, isAuthenticated } from '@/services/authServices';

// Route Configuration
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/inbox', name: 'inbox', component: Inbox, meta: { requiresAuth: true } },
  { path: '/favorite', name: 'favorite', component: Favorite, meta: { requiresAuth: true } },
  { path: '/cart', name: 'cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/contacts', name: 'contacts', component: Contacts },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/products', name: 'products', component: Products },
  { path: '/address', name: 'address', component: Address, meta: { requiresAuth: true } },
  { path: '/unauthorized', name: 'Unauthorized', component: () => import('../pages/Unauthorized.vue') },
  { path: '/details/:id', name: 'details', component: Details, meta: { requiresAuth: true } },

  // Admin Routes (Properly Structured)
  {
    path: '/admin',
    component: () => import('@/pages/admin/AdminLayout.vue'), // New Layout Wrapper
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: { name: 'AdminDashboard' } }, // Default to dashboard
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/AdminDashboard.vue'),
      },
      {
        path: 'manage-users',
        name: 'ManageUsers',
        component: () => import('@/pages/admin/ManageUsers.vue'),
        children: [
          {
            path: 'all-users',
            name: 'AllUsers',
            component: () => import('@/pages/admin/users/AllUsers.vue'),
          },
        ],
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/pages/admin/Product.vue'),
        children: [
          {
            path: 'all-products',
            name: 'AllProducts',
            component: () => import('@/pages/admin/products/AllProducts.vue'),
          },
          {
            path: 'create-product',
            name: 'CreateProduct',
            component: () => import('@/pages/admin/products/CreateProduct.vue'),
          },
        ],
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/pages/admin/Category.vue'),
        children: [
          {
            path: 'all-category',
            name: 'AllCategory',
            component: () => import('@/pages/admin/categories/AllCategory.vue'),
          },
          {
            path: 'create-category',
            name: 'CreateCategory',
            component: () => import('@/pages/admin/categories/CreateCategory.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'orders',
        name: 'AllOrders',
        component: () => import('@/pages/admin/orders/AllOrders.vue'),
      },
    ],
  },

  // Fallback Route
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

// Create Router Instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  try {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    if (requiresAuth || requiresAdmin) {
      if (!isAuthenticated()) {
        return next({ name: 'login' });
      }

      if (requiresAdmin) {
        const user = await getCurrentUser();
        if (user.roles?.includes('Admin')) {
          return next();
        }
        return next({ name: 'Unauthorized' });
      }
    }

    next();
  }
  catch (error) {
    console.error('Navigation Error:', error);
    next({ name: 'login' });
  }
});

export default router;
