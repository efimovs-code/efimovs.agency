import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    // Загружается только при открытии главной страницы
    component: () => import('../views/Home.vue'),
    meta: { 
      title: 'Efimovs Agency | Разработка сайтов и IT-услуги',
      description: 'Агентство Ефимова: создание премиальных веб-сайтов, приложений и внедрение AI-инструментов.'
    }
  },
  { 
    path: '/portfolio', 
    name: 'Portfolio', 
    // Загружается только при переходе в портфолио
    component: () => import('../views/Portfolio.vue'),
    meta: { 
      title: 'Портфолио | Efimovs Agency',
      description: 'Кейсы Агентства Ефимова: разработанные сайты, порталы и мобильные приложения.'
    }
  },
  { 
    path: '/careers', 
    name: 'Careers', 
    // Загружается только при переходе в карьеру
    component: () => import('../components/Careers.vue'),
    meta: { 
      title: 'Карьера | Efimovs Agency',
      description: 'Присоединяйтесь к команде разработчиков Efimovs Agency.'
    }
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

export default router