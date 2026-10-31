<template>
  <section class="projects-section" id="projects">
    <div v-if="isDesktop" class="ambient-glow opt-gpu" v-once></div>

    <div class="container">
      
      <div class="section-header">
        <span class="kicker">{{ t('projects_kicker') }}</span>
        <h2 class="gradient-title">
          {{ t('projects_title_1') }}<br class="mobile-br"><span class="desktop-space">&nbsp;&nbsp;</span>{{ t('projects_title_2') }}
        </h2>
      </div>

      <div class="desktop-grid gpu-scroll">
        <div 
          v-for="(project, index) in featuredProjects"
          :key="project.id"
          class="project-wrapper"
        >
          <router-link
            :to="project.link"
            class="project-item gpu-item"
          >
            <div class="image-box">
              <img
                :src="project.image"
                :alt="project.title"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class="gpu-image"
              />
              
              <div class="project-overlay" v-if="isDesktop"></div>

              <div class="btn-container" v-if="isDesktop">
                <div class="view-btn">
                  <span class="view-text">{{ t('btn_view_case') }}</span>
                  <svg
                    class="view-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    shape-rendering="optimizeSpeed"
                    v-once
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="square" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="project-info">
              <div class="info-header">
                <span class="category">{{ project.category }}</span>
              </div>
              <h3 class="name">
                {{ project.title }}
              </h3>
              <p class="task-desc">{{ project.task }}</p>
            </div>
          </router-link>
        </div>
      </div>

      <div class="marquee-wrapper mobile-marquee">
        <div class="marquee-track">
          <div class="marquee-set" v-for="setIdx in 2" :key="'set-' + setIdx">
            <router-link
              v-for="project in featuredProjects"
              :key="project.id + '-' + setIdx"
              :to="project.link"
              class="project-item gpu-item"
            >
              <div class="image-box">
                <img
                  :src="project.image"
                  :alt="project.title"
                  loading="lazy"
                  decoding="async"
                  class="gpu-image"
                />
              </div>
              <div class="project-info">
                <div class="info-header">
                  <span class="category">{{ project.category }}</span>
                </div>
                <h3 class="name">
                  {{ project.title }}
                </h3>
                <p class="task-desc">{{ project.task }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div class="all-cases-action">
        <router-link to="/portfolio" class="btn-outline-platinum">
          <span class="text">{{ t('btn_all_cases') }}</span>
          <div class="btn-flare" v-if="isDesktop" v-once></div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { t } from "../composables/useLanguage";

const featuredProjects = computed(() => [
  {
    id: 1,
    link: "/portfolio#aima", 
    title: t('proj1_title'),
    category: t('cat_web'),
    task: t('proj1_task'),
    image: "/images/aima-1.png", 
  },
  {
    id: 2,
    link: "/portfolio#corporate-sports",
    title: t('proj2_title'),
    category: t('cat_mob'),
    task: t('proj2_task'),
    image: "/images/sports-1.png", 
  },
  {
    id: 3,
    link: "/portfolio#shortlyst",
    title: t('proj3_title'),
    category: t('cat_web'),
    task: t('proj3_task'),
    image: "/images/shortlyst-1.png", 
  },
  {
    id: 4,
    link: "/portfolio#vitolker",
    title: t('proj4_title'),
    category: t('cat_mob'),
    task: t('proj4_task'),
    image: "/images/vitolker-1.png", 
  }
]);

const isDesktop = ref(true);
let lastWidth = 0;
let resizeTimer = null;

const checkDevice = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastWidth) {
      isDesktop.value = currentWidth >= 1024;
      lastWidth = currentWidth;
    }
  }, 100); 
};

onMounted(() => {
  lastWidth = window.innerWidth;
  isDesktop.value = window.innerWidth >= 1024;
  window.addEventListener("resize", checkDevice, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDevice);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
.gpu-scroll {
  -webkit-overflow-scrolling: touch;
  -webkit-transform: translateZ(0px);
  transform: translateZ(0px);
}
.gpu-item {
  -webkit-transform: translateZ(0px);
  transform: translateZ(0px);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.gpu-image {
  -webkit-transform: translateZ(0px);
  transform: translateZ(0px);
}

.projects-section {
  position: relative;
  background-color: transparent !important;
  padding: 150px 0px;
  font-family: "Plus Jakarta Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; 
  text-rendering: optimizeLegibility;
  contain: paint style; 
  isolation: isolate;
}

.ambient-glow { 
  position: absolute; 
  top: 150px; 
  left: 50%; 
  transform: translateX(-50%) translateZ(0); 
  width: 1400px; 
  height: 600px; 
  background: radial-gradient(ellipse closest-side, rgba(255, 255, 255, 0.04) 0px, transparent 100%); 
  z-index: -1; 
  pointer-events: none;
  will-change: transform;
}

.container {
  max-width: 1400px;
  margin: 0px auto;
  padding: 0px 40px;
}

.mobile-br { display: none; }
.desktop-space { display: inline; }

.desktop-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 60px;
  margin-top: clamp(48px, 6vw, 88px);
}

.desktop-grid .project-wrapper {
  width: 48%; 
  position: relative;
}

.desktop-grid .project-wrapper:nth-child(odd) {
  align-self: flex-start;
}

.desktop-grid .project-wrapper:nth-child(even) {
  align-self: flex-end;
}

.desktop-grid .project-wrapper:nth-child(n+2) {
  margin-top: -12%; 
}

.desktop-grid .project-item {
  width: 100%;
  display: block;
  text-decoration: none;
  outline: none;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.image-box {
  position: relative;
  overflow: hidden;
  background: #09090b;
  aspect-ratio: 16 / 10 !important; 
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  -webkit-transform: translateZ(0px);
  transform: translateZ(0px);
  transition: border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.image-box::after {
  content: '';
  position: absolute;
  inset: 0px;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.12) 50%,
    transparent 55%
  );
  transform: translateX(-100%) translateZ(0);
  z-index: 8;
  pointer-events: none;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.1) brightness(0.9);
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease;
  will-change: transform;
}

.project-info {
  margin-top: 35px;
  padding-left: 5px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.project-info .category {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 3.3px;
  color: #a1a1aa;
}

.project-info .name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: clamp(28px, 2.5vw, 36px);
  font-weight: 700;
  margin: 0px 0px 12px 0px;
  letter-spacing: -1px;
  color: #f4f4f5;
  transition: color 0.4s ease;
}

.project-info .task-desc {
  font-size: 15px;
  line-height: 24px;
  color: #8a8a93;
  margin: 0px;
  max-width: 90%;
  transition: color 0.4s ease;
}

.project-overlay {
  position: absolute;
  inset: 0px;
  background: radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%);
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 10;
  pointer-events: none;
}

.btn-container {
  position: absolute;
  inset: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11; 
  pointer-events: none;
}

.view-btn {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 32px;
  border-radius: 100px;
  opacity: 0;
  -webkit-backdrop-filter: blur(0px);
  backdrop-filter: blur(0px);
  -webkit-transform: translateY(30px) scale(0.9) translateZ(0);
  transform: translateY(30px) scale(0.9) translateZ(0);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.3s ease,
              border-color 0.3s ease;
  will-change: transform, opacity;
}

.view-text {
  color: #ffffff;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  transition: color 0.3s ease;
}

.view-arrow {
  width: 16px;
  height: 16px;
  color: #ffffff;
  transition: transform 0.3s ease, color 0.3s ease;
}

@media (hover: hover) and (pointer: fine) {
  .desktop-grid .project-wrapper:hover {
    z-index: 2; 
  }
  
  .project-item:hover .image-box {
    border-color: #e5e4e2; 
    transform: translateY(-8px) translateZ(0px);
  }

  .project-item:hover .image-box::after {
    transform: translateX(100%) translateZ(0);
  }

  .project-item:hover .image-box img {
    -webkit-transform: scale(1.06) translateZ(0px);
    transform: scale(1.06) translateZ(0px);
    filter: grayscale(0) brightness(1.05);
  }
  
  .project-item:hover .project-overlay {
    opacity: 1;
  }
  
  .project-item:hover .view-btn {
    opacity: 1;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    -webkit-transform: translateY(0px) scale(1) translateZ(0);
    transform: translateY(0px) scale(1) translateZ(0);
    background: rgba(255, 255, 255, 0.12);
  }
  
  .project-item .view-btn:hover {
    background: #ffffff !important;
    border-color: #ffffff !important;
  }
  
  .project-item .view-btn:hover .view-text,
  .project-item .view-btn:hover .view-arrow {
    color: #000000 !important;
  }
  
  .project-item .view-btn:hover .view-arrow {
    -webkit-transform: translate3d(5px, 0px, 0px);
    transform: translate3d(5px, 0px, 0px);
  }
  
  .project-item:hover .project-info .name {
    color: #ffffff;
  }
  
  .project-item:hover .project-info .task-desc {
    color: #b0b0b0;
  }
}

.mobile-marquee { display: none; }

.all-cases-action {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}

.btn-outline-platinum {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 22px 50px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 100px;
  background: transparent;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  overflow: hidden;
  transition: background-color 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s; 
  touch-action: manipulation;
}

.btn-outline-platinum .text {
  position: relative;
  z-index: 2;
  color: #ffffff;
  transition: color 0.3s ease;
}

.btn-outline-platinum .btn-flare {
  position: absolute;
  top: 0px;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  -webkit-transform: skewX(-20deg);
  transform: skewX(-20deg);
  transition: left 0.5s;
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  .btn-outline-platinum:hover {
    background: #e5e4e2;
    border-color: #e5e4e2;
  }
  .btn-outline-platinum:hover .text {
    background: none !important;
    -webkit-text-fill-color: #000000 !important;
    color: #000000 !important;
    animation: none !important;
  }
  .btn-outline-platinum:hover .btn-flare {
    left: 150%;
    transition: left 0.7s;
  }
}

@media (min-width: 1024px) and (max-width: 1366px) {
  .desktop-grid .project-wrapper:nth-child(n+2) {
    margin-top: -10%;
  }
  .project-info { margin-top: 30px; }
  .project-info .category { font-size: 10px; letter-spacing: 2px; }
  .project-info .name { font-size: 32px; margin-top: 10px; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .gradient-title {
    font-size: clamp(44px, 6vw, 56px) !important;
    text-align: center;
  }
  .mobile-br { display: block !important; }
  .desktop-space { display: none !important; }
}

@media (max-width: 1023px) {
  .desktop-grid { display: none !important; }
  .mobile-marquee { display: block !important; }

  .marquee-wrapper {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    overflow: hidden;
    position: relative;
    touch-action: pan-y;
    margin-top: clamp(36px, 6vw, 48px);
  }

  .marquee-track { display: flex; width: max-content; }

  .marquee-set {
    display: flex;
    gap: 20px;
    padding-right: 20px;
    -webkit-animation: luxuryMarquee 25s linear infinite;
    animation: luxuryMarquee 25s linear infinite;
    -webkit-transform: translateZ(0px);
    transform: translateZ(0px);
    will-change: transform;
  }

  @-webkit-keyframes luxuryMarquee {
    0% { -webkit-transform: translate3d(0px, 0px, 0px); }
    100% { -webkit-transform: translate3d(-100%, 0px, 0px); }
  }
  @keyframes luxuryMarquee {
    0% { transform: translate3d(0px, 0px, 0px); }
    100% { transform: translate3d(-100%, 0px, 0px); }
  }

  .mobile-marquee .project-item {
    width: 360px; 
    flex-shrink: 0;
    margin-top: 0px !important;
    grid-column: auto !important;
  }
  .mobile-marquee .image-box { aspect-ratio: 16 / 11 !important; }
  .all-cases-action { margin-top: 50px; }
}

@media (max-width: 767px) {
  .projects-section { padding: 80px 0px !important; background-color: transparent !important; }
  .mobile-br { display: block; }
  .desktop-space { display: none; }
  .project-info { margin-top: 20px; }
  .project-info .category { font-size: 10px; }
  .project-info .name { font-size: 24px; }
  .project-info .task-desc { font-size: 13px; max-width: 100%; }
  .btn-outline-platinum { width: 100%; padding: 18px 0px; font-size: 13px; min-height: 56px; }
  .marquee-set { -webkit-animation-duration: 20s; animation-duration: 20s; }
  .mobile-marquee .project-item { width: 300px; }
}

@media (hover: none) {
  .image-box .project-overlay { display: none !important; }
  .image-box img {
    filter: brightness(0.95) !important;
    -webkit-transform: translateZ(0px) !important;
    transform: translateZ(0px) !important;
  }
  .btn-outline-platinum:active { background: #e5e4e2; border-color: #e5e4e2; }
  .btn-outline-platinum:active .text { background: none !important; -webkit-text-fill-color: #000000 !important; color: #000000 !important; animation: none !important; }
}

@media (max-width: 1199px) {
  .marquee-wrapper { margin-left: -40px !important; margin-right: -40px !important; width: auto !important; overflow: hidden !important; touch-action: pan-y !important; }
  .gpu-item, .gpu-image, .project-item { -webkit-backface-visibility: hidden !important; backface-visibility: hidden !important; }
  .marquee-set { display: flex !important; -webkit-transform: none; transform: none; -webkit-animation: marqueeScrollMobile 20s linear infinite !important; animation: marqueeScrollMobile 20s linear infinite !important; }
  
  @-webkit-keyframes marqueeScrollMobile {
    0% { -webkit-transform: translate3d(0px, 0px, 0px); }
    100% { -webkit-transform: translate3d(-100%, 0px, 0px); }
  }
  @keyframes marqueeScrollMobile {
    0% { transform: translate3d(0px, 0px, 0px); }
    100% { transform: translate3d(-100%, 0px, 0px); }
  }
}
</style>