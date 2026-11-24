import { createRouter, createWebHistory } from 'vue-router';

// --- ROUTE DEFINITIONS (LAZY-LOADED)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Efimovs Agency',
      description: 'Efimovs Agency - Development of conversion-focused websites that turn visitors into clients.',
    },
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: () => import('../views/Portfolio.vue'),
    meta: {
      title: 'Portfolio | Efimovs Agency',
      description: 'Efimovs Agency Case Studies: Websites Developed.',
    },
  },
  // --- FALLBACK FOR UNKNOWN ROUTES (404)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
];

// --- ROUTER INSTANCE
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // --- DISABLE NATIVE SCROLL (HANDLED IN APP.VUE)
    return false;
  },
});

// --- UPDATE SEO META TAGS ON ROUTE CHANGE
router.beforeEach((to) => {
  document.title = to.meta.title || 'Efimovs Agency';

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && to.meta.description) {
    metaDescription.setAttribute('content', to.meta.description);
  }
});

// --- HANDLE STALE CHUNK ERRORS AFTER NEW DEPLOYMENTS
router.onError((error, to) => {
  const message = error?.message || '';
  const isChunkLoadFailed =
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed');

  if (isChunkLoadFailed) {
    window.location.href = to.fullPath;
  }
});

export default router;