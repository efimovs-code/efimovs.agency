import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    // Загружается только при открытии главной страницы (Code Splitting)
    component: () => import('../views/Home.vue'),
    meta: { 
      title: 'Efimovs Agency | Conversion-Focused Websites',
      description: 'Efimovs Agency - Development of conversion-focused websites that turn visitors into clients.'
    }
  },
  { 
    path: '/portfolio', 
    name: 'Portfolio', 
    // Загружается только при переходе в портфолио
    component: () => import('../views/Portfolio.vue'),
    meta: { 
      title: 'Portfolio | Efimovs Agency',
      description: 'Efimov Agency Case Studies: Websites Developed.'
    }
  },
  // Защита от несуществующих маршрутов (404)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 🌟 ПОЛНОСТЬЮ ОТКЛЮЧАЕМ ВСТРОЕННЫЙ СКРОЛЛ VUE ROUTER 🌟
    // Теперь за всё отвечает Lenis в App.vue, чтобы не было никаких промигиваний
    return false;
  }
})

// Динамическая смена SEO-тегов при переходах
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Efimovs Agency';
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && to.meta.description) {
    metaDesc.setAttribute('content', to.meta.description);
  }

  next();
})

// Защита от сбоев при загрузке асинхронных чанков (особенно актуально для Vercel)
router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed')) {
    // Если пользователь пытался перейти на страницу, но JS-файл обновился на сервере - делаем хард-релоад
    window.location = to.fullPath;
  }
});

export default router