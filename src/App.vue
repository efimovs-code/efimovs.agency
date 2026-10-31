<template>
  <router-view v-if="isStandalonePage" />

  <div v-else id="app">
    
    <div class="app-shell" v-if="renderSite">
      
      <div class="header-wrapper" :class="{ 'header-wrapper--visible': headerVisible }">
        <Header 
          v-if="headerVisible && !isPortfolioPage" 
          :is-modal-open="isModalOpen"
          @open-contact="openWithStack(null)" 
        />
      </div>

      <main class="site-content">
        <router-view v-slot="{ Component }">
          <component 
            :is="Component" 
            :key="route.path + '-' + animationKey"
            :deferHeavyComponents="deferHeavyComponents"
            @open-contact="openWithStack(null)"
            @open-specific="openWithStack"
          />
        </router-view>
      </main>

      <Footer v-show="deferHeavyComponents && !isPortfolioPage" @openModal="openWithStack(null)" />

      <Teleport to="body">
        <ContactModal
          :isOpen="isModalOpen"
          @close="isModalOpen = false"
          :initial-stack="selectedStack"
          :initial-service="selectedService"
          initial-plan=""
        />
      </Teleport>
    </div>

    <IntroSequence 
      v-if="introActive" 
      @start-fade="handleIntroStartFade" 
      @intro-finished="handleIntroDestroy" 
    />

    <div class="starlight-bg opt-gpu">
      <div class="ambient-aura"></div>
      <div class="hero-focus-glow"></div>
      <div class="scene-depth-glow"></div>
      <div class="luxury-vignette"></div>

      <div
        ref="starLayerFar"
        class="star-layer layer-far opt-gpu"
      ></div>

      <div
        ref="starLayerMid"
        class="star-layer layer-mid opt-gpu"
      ></div>

      <div
        ref="starLayerNear"
        class="star-layer layer-near opt-gpu"
      ></div>

      <div class="shooting-star"></div>
      <div class="luxury-noise"></div>
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
  watch
} from "vue";
import { useRoute, useRouter } from "vue-router";
import Lenis from "lenis";
import { gsap } from "gsap";

import IntroSequence from "./components/IntroSequence.vue";
import Header from "./components/Header.vue";

const Footer = defineAsyncComponent(() => import("./components/Footer.vue"));
const ContactModal = defineAsyncComponent(() => import("./components/ContactModal.vue"));

const route = useRoute();
const router = useRouter();

const isStandalonePage = computed(() => false); 
const isPortfolioPage = computed(() => route.name === 'Portfolio' || route.name === 'Careers');

const isModalOpen = ref(false);
const selectedStack = shallowRef(null);
const selectedService = ref(""); 
const isDesktop = ref(true);

const starLayerFar = ref(null);
const starLayerMid = ref(null);
const starLayerNear = ref(null);

const renderSite = ref(true);      
const animationKey = ref(0);       
const introActive = ref(true);     
const headerVisible = ref(false);
const deferHeavyComponents = ref(false);

let lenis = null;
let lastWidth = 0;
let resizeObserver = null;

const forceGlassRepaint = () => {
  setTimeout(() => {
    const glassNodes = document.querySelectorAll('.header-glass, .card, .premium-row, .minimal-sub-card, .luxury-card');
    
    for (let i = 0; i < glassNodes.length; i++) {
      const node = glassNodes[i];
      const oldDisplay = node.style.display;
      node.style.display = 'none';
      void node.offsetHeight; 
      node.style.display = oldDisplay;
    }
  }, 20); 
};

router.beforeEach((to, from, next) => {
  if (from.path === '/') {
    const currentScroll = window.lenis ? window.lenis.scroll : window.scrollY;
    sessionStorage.setItem('efimovs_scroll_y', currentScroll.toString());
  }
  next();
});

router.afterEach((to, from) => {
  if (to.path === '/' && from.path === '/careers') {
    nextTick(() => {
      void document.documentElement.offsetHeight; 
      
      const saved = parseInt(sessionStorage.getItem('efimovs_scroll_y') || '0', 10);
      const finalScroll = saved > 100 ? saved : document.documentElement.scrollHeight;

      window.scrollTo({ top: finalScroll, behavior: 'instant' });
      
      if (lenis) {
        lenis.resize(); 
        lenis.scrollTo(finalScroll, { immediate: true, force: true });
      }
    });
  } 
  else {
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true, force: true });
      }
    });
  }
});

watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('global-modal-open');
  } else {
    document.body.classList.remove('global-modal-open');
  }
});

const openWithStack = (stackName, serviceName = "") => {
  selectedStack.value = stackName;
  selectedService.value = serviceName; 
  isModalOpen.value = true;
};

const handleScroll = () => {
  if (!isDesktop.value) return;

  const currentScroll = lenis ? Math.max(0, lenis.scroll) : window.scrollY;
  
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

const checkDevice = () => {
  const currentWidth = window.innerWidth;
  if (currentWidth !== lastWidth) {
    isDesktop.value = currentWidth >= 1024;
    lastWidth = currentWidth;
  }
};

const initLenis = () => {
  if (!isDesktop.value || lenis) return;
  
  lenis = new Lenis({
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  window.lenis = lenis;
  lenis.on('scroll', handleScroll);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  resizeObserver = new ResizeObserver(() => {
    if (lenis) lenis.resize();
  });
  resizeObserver.observe(document.body);
};

const handleIntroStartFade = async () => {
  renderSite.value = false; 
  animationKey.value++; 
  await nextTick(); 
  renderSite.value = true; 
};

const handleIntroDestroy = () => {
  introActive.value = false;
  headerVisible.value = true; 
  
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  
  if (lenis) {
    lenis.start();
  }

  const loadHeavyComponents = async () => {
    deferHeavyComponents.value = true;
    await nextTick(); 
    if (lenis) lenis.resize(); 
  };
  setTimeout(loadHeavyComponents, 100);
};

onMounted(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (isStandalonePage.value) return;

  lastWidth = window.innerWidth;
  isDesktop.value = window.innerWidth >= 1024;

  const introSeen = sessionStorage.getItem('introSeen');

  if (introSeen) {
    introActive.value = false;
    setTimeout(() => { headerVisible.value = true; }, 50);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    if (isDesktop.value) {
      initLenis();
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    const loadHeavyComponents = async () => {
      deferHeavyComponents.value = true;
      await nextTick(); 
      if (lenis) lenis.resize(); 
    };
    setTimeout(loadHeavyComponents, 100);

  } else {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    if (isDesktop.value) {
      initLenis();
      lenis.stop(); 
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  }

  window.addEventListener("resize", checkDevice, { passive: true });
  window.addEventListener('refresh-header-glass', forceGlassRepaint);
});

onBeforeUnmount(() => {
  if (isStandalonePage.value) return;
  if (resizeObserver) resizeObserver.disconnect();
  
  gsap.ticker.remove((time) => {
    if (lenis) lenis.raf(time * 1000);
  });
  
  if (lenis) {
    lenis.off('scroll', handleScroll);
    lenis.destroy();
    window.lenis = null; 
  } else {
    window.removeEventListener('scroll', handleScroll);
  }

  window.removeEventListener("resize", checkDevice);
  window.removeEventListener('refresh-header-glass', forceGlassRepaint);
});
</script>

<style>
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
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.header-wrapper.header-wrapper--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.app-shell {
  position: relative;
  z-index: 1;
  width: 100%;
}

html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden !important; }
.lenis.lenis-smooth iframe { pointer-events: none; }

html, body {
  background-color: #000000;
  color: #fff;
  margin: 0;
  padding: 0;
  overflow-anchor: none;
  width: 100%;
  min-height: 100%;
  -webkit-text-size-adjust: 100%;
  overflow-x: hidden; 
}

html.scroll-locked, body.scroll-locked { overflow: hidden !important; }

#app {
  width: 100%;
  position: relative;
  z-index: 1;
}

.site-content {
  position: relative;
  z-index: 10;
  width: 100%;
}

.starlight-bg {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; 
  height: 100vh;
  background-color: #000000;
  z-index: -999;
  overflow: hidden;
  pointer-events: none;
}

.ambient-aura { position: absolute; inset: 0; z-index: 2; }
.hero-focus-glow { position: absolute; inset: 0; z-index: 3; }
.scene-depth-glow { position: absolute; inset: 0; z-index: 4; }
.luxury-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, #000000 100%);
  z-index: 5;
}

.luxury-noise { display: none; }

.shooting-star {
  position: absolute; top: 15%; right: 15%;
  width: 150px; height: 1px;
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
  0% { transform: translate3d(200px, -200px, 0) rotate(-35deg) scaleX(0); opacity: 0; }
  3% { opacity: 1; transform: translate3d(0, 0, 0) rotate(-35deg) scaleX(1); }
  6% { transform: translate3d(-1200px, 800px, 0) rotate(-35deg) scaleX(0.2); opacity: 0; }
  100% { transform: translate3d(-1200px, 800px, 0) rotate(-35deg) scaleX(0); opacity: 0; }
}

.star-layer {
  position: absolute; 
  top: -800px; 
  left: 0;
  width: 100%; 
  height: calc(100vh + 1600px); 
  will-change: transform; 
  z-index: 3;
}

@keyframes twinkleSubtle { 0% { opacity: 0.45; } 100% { opacity: 1; } }
@keyframes twinkleSubtleAlt { 0% { opacity: 1; } 100% { opacity: 0.4; } }

.layer-far {
  background-image:
    radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.9) 1px, transparent 2px),
    radial-gradient(circle at 85% 10%, rgba(255, 255, 255, 0.78) 1px, transparent 2px),
    radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.7) 1px, transparent 2px),
    radial-gradient(circle at 75% 80%, rgba(255, 255, 255, 0.88) 1px, transparent 2px);
  background-size: 340px 340px; opacity: 0.45;
}
.layer-mid {
  background-image:
    radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.95) 1px, transparent 3px),
    radial-gradient(circle at 80% 45%, rgba(255, 255, 255, 0.82) 1px, transparent 3px),
    radial-gradient(circle at 35% 85%, rgba(255, 255, 255, 0.74) 1px, transparent 3px);
  background-size: 520px 520px;
  animation: twinkleSubtle 8s ease-in-out infinite alternate; opacity: 0.55;
}
.layer-near {
  background-image:
    radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 1) 1.2px, transparent 5px),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.9) 1.2px, transparent 5px),
    radial-gradient(circle at 45% 55%, rgba(255, 255, 255, 0.82) 1.2px, transparent 5px);
  background-size: 720px 720px;
  animation: twinkleSubtleAlt 12s ease-in-out infinite alternate; opacity: 0.6;
}

::-webkit-scrollbar { width: 8px; background-color: #000; }
::-webkit-scrollbar-track { background-color: #000; border-left: 1px solid rgba(255, 255, 255, 0.02); }
::-webkit-scrollbar-thumb { background-color: #222; border-radius: 10px; border: 2px solid #000; }
@media (hover: hover) and (pointer: fine) {
  ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #f1f1f1 0%, #d7d7d7 50%, #8d8d8d 100%); border: 1px solid #000; }
}

html { scrollbar-width: thin; scrollbar-color: #333 #000; scrollbar-gutter: stable; overflow-y: auto; }

@media (max-width: 1024px) { 
  .star-layer { 
    will-change: auto; 
    animation: none; 
    display: none; 
  } 

  .starlight-bg {
    width: 100vw;
    height: 100dvh;
    top: 0;
    left: 0;
  }
}
@media (max-width: 768px) {
  .layer-far { opacity: 0.28; background-size: 460px 460px; }
  .layer-mid { opacity: 0.34; background-size: 620px 620px; }
  .layer-near { opacity: 0.4; background-size: 860px 860px; }
}
</style>