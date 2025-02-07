import { createRouter, createWebHistory } from 'vue-router';

// Import Components
import About from '../pages/About.vue';
import Contacts from '../pages/Contacts.vue';
import Details from '../pages/Details.vue';
import Favorite from '../pages/Favorite.vue';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import NotFound from '../pages/NotFound.vue';
import Products from '../pages/Products.vue';
import Register from '../pages/Register.vue';

// Navigation guard for protected routes
import { getCurrentUser, isAuthenticated } from '@/services/authServices';
import Cart from '../pages/Cart.vue';

// Route Configuration
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/favorite', name: 'favorite', component: Favorite, meta: { requiresAuth: true } },
  { path: '/cart', name: 'cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/contacts', name: 'contacts', component: Contacts },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/products', name: 'products', component: Products },
  { path: '/unauthorized', name: 'Unauthorized', component: () => import('../pages/Unauthorized.vue') },
  { path: '/details/:id', name: 'details', component: Details, meta: { requiresAuth: true } },
  {
    path: '/admin',
    name: 'Admin',
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/AdminDashboard.vue'),
      },
      { path: 'mermaidDiagram', name: 'mermaidDiagram', component: () => import('@/pages/admin/MermaidDiagram.vue') },
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
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }, // Fallback Route
];

// Create Router Instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  console.log('Navigating to:', to.fullPath); // Debugging navigation
  console.log('Matched routes:', to.matched.map(route => route.path)); // Debugging matched routes

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
