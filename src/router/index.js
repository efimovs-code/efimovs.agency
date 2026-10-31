import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    // Загружается только при открытии главной страницы
    component: () => import('../views/Home.vue') 
  },
  { 
    path: '/portfolio', 
    name: 'Portfolio', 
    // Загружается только при переходе в портфолио
    component: () => import('../views/Portfolio.vue') 
  },
  { 
    path: '/careers', 
    name: 'Careers', 
    // Загружается только при переходе в карьеру
    component: () => import('../components/Careers.vue') 
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

export default router