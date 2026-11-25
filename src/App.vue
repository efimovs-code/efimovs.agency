<template>
  <div id="app">
    <div class="app-shell">
      <!-- GLOBAL HEADER -->
      <div class="header-wrapper">
        <Header
          v-if="!isPortfolioPage"
          :is-modal-open="isModalOpen"
          @open-contact="openWithStack(null)"
        />
      </div>

      <!-- ACTIVE ROUTE VIEW -->
      <main class="site-content">
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :key="route.path"
            deferHeavyComponents="true"
            @vue:mounted="onRouteMounted"
            @open-contact="openWithStack(null)"
            @open-specific="openWithStack"
          />
        </router-view>
      </main>

      <!-- GLOBAL FOOTER -->
      <Footer
        v-if="!isPortfolioPage && isPageMounted"
        @openModal="openWithStack(null)"
      />

      <!-- GLOBAL CONTACT MODAL -->
      <Teleport to="body">
        <ContactModal
          :isOpen="isModalOpen"
          :initial-stack="selectedStack"
          :initial-service="selectedService"
          initial-plan=""
          @close="isModalOpen = false"
        />
      </Teleport>
    </div>

    <!-- AMBIENT STARLIGHT BACKGROUND -->
    <div class="starlight-bg" aria-hidden="true">
      <div class="luxury-vignette"></div>

      <!-- Render parallax star layers only on desktop -->
      <template v-if="isDesktop">
        <div ref="starLayerFar" class="star-layer layer-far"></div>
        <div ref="starLayerMid" class="star-layer layer-mid"></div>
        <div ref="starLayerNear" class="star-layer layer-near"></div>
        <div class="shooting-star"></div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  shallowRef,
  computed,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent,
  nextTick,
  watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Lenis from 'lenis';
import { gsap } from 'gsap';

import Header from './components/Header.vue';

/* ASYNC GLOBAL COMPONENTS */
const Footer = defineAsyncComponent(() => import('./components/Footer.vue'));
const ContactModal = defineAsyncComponent(() => import('./components/ContactModal.vue'));

const route = useRoute();
const router = useRouter();

/* ROUTER & UI STATE */
const isPortfolioPage = computed(
  () => route.name === 'Portfolio' || route.name === 'Careers'
);

const isModalOpen = ref(false);
const isPageMounted = ref(false);
const selectedStack = shallowRef(null);
const selectedService = ref('');
const isDesktop = ref(true);

const starLayerFar = ref(null);
const starLayerMid = ref(null);
const starLayerNear = ref(null);

let lenis = null;
let lastWidth = 0;
let lastScrollY = -1;
let savedModalScrollY = 0;
let removeBeforeEach = null;
let removeAfterEach = null;

/* ROUTE MOUNT & SCROLL RESTORATION */
const onRouteMounted = () => {
  isPageMounted.value = true;
  nextTick(() => {
    if (lenis) lenis.resize();
  });
};

removeBeforeEach = router.beforeEach((to, from) => {
  if (to.path !== from.path) {
    isPageMounted.value = false;
  }

  if (from.path === '/') {
    const currentScroll = window.lenis ? window.lenis.scroll : window.scrollY;
    sessionStorage.setItem('efimovs_scroll_y', currentScroll.toString());
  }
});

removeAfterEach = router.afterEach((to, from) => {
  nextTick(() => {
    let finalScroll = 0;

    if (to.path === '/' && from.path === '/careers') {
      const saved = parseInt(sessionStorage.getItem('efimovs_scroll_y') || '0', 10);
      finalScroll = saved > 100 ? saved : document.documentElement.scrollHeight;
    }

    window.scrollTo({ top: finalScroll, behavior: 'instant' });

    if (lenis) {
      lenis.resize();
      lenis.scrollTo(finalScroll, { immediate: true, force: true });
    }
  });
});

/* MODAL SCROLL LOCK (PREVENTS BACKGROUND SHIFT IN IOS TELEGRAM WEBVIEW) */
watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    savedModalScrollY = lenis ? lenis.scroll : window.scrollY;
    document.documentElement.classList.add('global-modal-open');
    document.body.classList.add('global-modal-open');
    document.body.style.top = `-${savedModalScrollY}px`;
    if (lenis) lenis.stop();
  } else {
    document.documentElement.classList.remove('global-modal-open');
    document.body.classList.remove('global-modal-open');
    document.body.style.top = '';
    window.scrollTo({ top: savedModalScrollY, behavior: 'instant' });
    if (lenis) {
      lenis.start();
      lenis.scrollTo(savedModalScrollY, { immediate: true, force: true });
    }
  }
});

const openWithStack = (stackName, serviceName = '') => {
  selectedStack.value = stackName;
  selectedService.value = serviceName;
  isModalOpen.value = true;
};

/* DESKTOP STARFIELD PARALLAX */
const updateStars = (currentScroll) => {
  if (!isDesktop.value || currentScroll === lastScrollY) return;
  lastScrollY = currentScroll;

  if (starLayerFar.value) {
    const y = -(currentScroll * 0.15) % 340;
    starLayerFar.value.style.transform = `translate3d(0, ${y}px, 0)`;
  }

  if (starLayerMid.value) {
    const y = -(currentScroll * 0.3) % 520;
    starLayerMid.value.style.transform = `translate3d(0, ${y}px, 0)`;
  }

  if (starLayerNear.value) {
    const y = -(currentScroll * 0.6) % 720;
    starLayerNear.value.style.transform = `translate3d(0, ${y}px, 0)`;
  }
};

/* LENIS SMOOTH SCROLL (DESKTOP ONLY) */
const onTick = (time) => {
  if (!lenis) return;
  lenis.raf(time * 1000);
  updateStars(lenis.scroll);
};

const initLenis = () => {
  if (!isDesktop.value || lenis) return;

  lenis = new Lenis({
    duration: 0.8,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    autoResize: true,
  });

  window.lenis = lenis;
  lastScrollY = -1;

  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);
};

const destroyLenis = () => {
  gsap.ticker.remove(onTick);

  if (lenis) {
    lenis.destroy();
    lenis = null;
    window.lenis = null;
  }
};

/* RESPONSIVE DEVICE CHECK (IGNORES VERTICAL TOOLBAR RESIZES) */
const checkDevice = () => {
  const currentWidth = window.innerWidth;
  if (currentWidth === lastWidth) return;

  lastWidth = currentWidth;
  const nextIsDesktop = currentWidth >= 1024;

  if (nextIsDesktop !== isDesktop.value) {
    isDesktop.value = nextIsDesktop;
    if (nextIsDesktop) {
      initLenis();
    } else {
      destroyLenis();
    }
  }
};

/* LIFECYCLE */
onMounted(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  lastWidth = window.innerWidth;
  isDesktop.value = lastWidth >= 1024;

  if (isDesktop.value) {
    initLenis();
  }

  window.addEventListener('resize', checkDevice, { passive: true });
});

onBeforeUnmount(() => {
  if (removeBeforeEach) removeBeforeEach();
  if (removeAfterEach) removeAfterEach();

  destroyLenis();
  document.documentElement.classList.remove('global-modal-open');
  document.body.classList.remove('global-modal-open');
  document.body.style.top = '';
  window.removeEventListener('resize', checkDevice);
});
</script>

<style>
/* GLOBAL HEADER & MODAL OVERRIDES */
html.global-modal-open,
body.global-modal-open {
  overflow: hidden !important;
}

body.global-modal-open {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
}

body.global-modal-open .header {
  opacity: 0 !important;
  pointer-events: none !important;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  opacity: 1;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  pointer-events: auto;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.app-shell {
  position: relative;
  z-index: 1;
  width: 100%;
}

/* LENIS SCROLL HELPERS */
html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden !important;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}

/* ROOT CONTAINERS */
html {
  height: 100%;
  background-color: #000000;
  overflow-anchor: none;
  scrollbar-width: thin;
  scrollbar-color: #333333 #000000;
}

body {
  min-height: 100%;
  background-color: #000000;
}

#app {
  width: 100%;
  min-height: 100%;
  position: relative;
  z-index: 1;
}

.site-content {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: 100%;
}

/* AMBIENT STARLIGHT BACKGROUND (STATIC INSET BLEED, NO VH UNITS) */
.starlight-bg {
  position: fixed;
  top: -100px;
  bottom: -100px;
  left: 0;
  right: 0;
  background-color: #000000;
  z-index: -999;
  overflow: hidden;
  pointer-events: none;
}

.luxury-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, #000000 100%);
  z-index: 5;
}

.shooting-star {
  position: absolute;
  top: 15%;
  right: 15%;
  width: 150px;
  height: 1px;
  background: linear-gradient(270deg, #ffffff, rgba(255, 255, 255, 0.72), transparent);
  border-radius: 50%;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.35));
  opacity: 0;
  transform-origin: right;
  animation: shootingStarAnim 15s linear infinite;
  z-index: 6;
  will-change: transform, opacity;
}

@keyframes shootingStarAnim {
  0% {
    transform: translate3d(200px, -200px, 0) rotate(-35deg) scaleX(0);
    opacity: 0;
  }
  3% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(-35deg) scaleX(1);
  }
  6% {
    transform: translate3d(-1200px, 800px, 0) rotate(-35deg) scaleX(0.2);
    opacity: 0;
  }
  100% {
    transform: translate3d(-1200px, 800px, 0) rotate(-35deg) scaleX(0);
    opacity: 0;
  }
}

.star-layer {
  position: absolute;
  top: -800px;
  left: 0;
  width: 100%;
  height: calc(100% + 1600px);
  will-change: transform;
  backface-visibility: hidden;
  z-index: 3;
}

@keyframes twinkleSubtle {
  0% {
    opacity: 0.45;
  }
  100% {
    opacity: 1;
  }
}

@keyframes twinkleSubtleAlt {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}

.layer-far {
  background-image:
    radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.9) 1px, transparent 2px),
    radial-gradient(circle at 85% 10%, rgba(255, 255, 255, 0.78) 1px, transparent 2px),
    radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.7) 1px, transparent 2px),
    radial-gradient(circle at 75% 80%, rgba(255, 255, 255, 0.88) 1px, transparent 2px);
  background-size: 340px 340px;
  opacity: 0.45;
}

.layer-mid {
  background-image:
    radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.95) 1px, transparent 3px),
    radial-gradient(circle at 80% 45%, rgba(255, 255, 255, 0.82) 1px, transparent 3px),
    radial-gradient(circle at 35% 85%, rgba(255, 255, 255, 0.74) 1px, transparent 3px);
  background-size: 520px 520px;
  animation: twinkleSubtle 8s ease-in-out infinite alternate;
  opacity: 0.55;
}

.layer-near {
  background-image:
    radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 1) 1.2px, transparent 5px),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.9) 1.2px, transparent 5px),
    radial-gradient(circle at 45% 55%, rgba(255, 255, 255, 0.82) 1.2px, transparent 5px);
  background-size: 720px 720px;
  animation: twinkleSubtleAlt 12s ease-in-out infinite alternate;
  opacity: 0.6;
}

/* CUSTOM SCROLLBAR */
::-webkit-scrollbar {
  width: 8px;
  background-color: #000000;
}

::-webkit-scrollbar-track {
  background-color: #000000;
  border-left: 1px solid rgba(255, 255, 255, 0.02);
}

::-webkit-scrollbar-thumb {
  background-color: #222222;
  border-radius: 10px;
  border: 2px solid #000000;
}

@media (hover: hover) and (pointer: fine) {
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #f1f1f1 0%, #d7d7d7 50%, #8d8d8d 100%);
    border: 1px solid #000000;
  }
}
</style>