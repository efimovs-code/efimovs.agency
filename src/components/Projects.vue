<template>
  <!-- Main featured projects section -->
  <section
    class="projects-section"
    id="projects"
  >
    <!-- Decorative ambient glow on desktop -->
    <div v-if="isDesktop" class="ambient-glow" aria-hidden="true"></div>

    <div class="container">
      <!-- Section header -->
      <div class="section-header">
        <span class="kicker">{{ t('projects_kicker') }}</span>
        <h2 class="gradient-title">{{ projectsTitle }}</h2>
      </div>

      <!-- Desktop staggered project list -->
      <div class="desktop-grid">
        <div
          v-for="project in featuredProjects"
          :key="project.id"
          class="project-wrapper"
        >
          <router-link :to="project.link" class="project-item">
            <div class="image-box">
              <img
                :src="project.image"
                :alt="project.title"
                loading="lazy"
                decoding="async"
              />

              <!-- Hover overlay and action button on desktop -->
              <div class="project-overlay"></div>

              <div class="btn-container">
                <div class="view-btn">
                  <span class="view-text">{{ t('btn_view_case') }}</span>
                  <svg
                    class="view-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="square" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="project-info">
              <h3 class="name">{{ project.title }}</h3>
              <p class="task-desc">{{ project.task }}</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Mobile & Tablet finger-swipe snap carousel -->
      <div class="projects-carousel">
        <div
          ref="scrollContainer"
          class="cards-wrapper gpu-scroll"
          @scroll.passive="onCarouselScroll"
          @scrollend="onCarouselScrollEnd"
        >
          <div
            v-for="(project, index) in featuredProjects"
            :key="'mobile-' + project.id"
            class="card-wrapper"
          >
            <router-link
              :to="project.link"
              :class="[
                'project-item',
                { 'is-mobile-active': !isDesktop && index === activeMobileIndex }
              ]"
            >
              <div class="image-box">
                <img
                  :src="project.image"
                  :alt="project.title"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="project-info">
                <h3 class="name">{{ project.title }}</h3>
                <p class="task-desc">{{ project.task }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Link to full portfolio page -->
      <div class="all-cases-action">
        <router-link to="/portfolio" class="btn-outline-platinum">
          <span class="text">{{ t('btn_all_cases') }}</span>
          <div class="btn-flare"></div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { t } from '../composables/useLanguage';

const scrollContainer = ref(null);
const isDesktop = ref(true);
const activeMobileIndex = ref(0);

let rafId = null;
let scrollSettleTimer = null;
let resizeTimer = null;
let lastWidth = 0;

// Combine two title parts into a single section heading
const projectsTitle = computed(() => {
  const firstPart = t('projects_title_1') || '';
  const secondPart = t('projects_title_2') || '';
  return `${firstPart} ${secondPart}`.trim();
});

// Featured projects list using dictionary keys for localization
const featuredProjects = computed(() => [
  {
    id: 1,
    link: '/portfolio#aima',
    title: t('proj1_title'),
    task: t('proj1_task'),
    image: '/images/aima-1.png',
  },
  {
    id: 2,
    link: '/portfolio#geometriya',
    title: t('proj2_title'),
    task: t('proj2_task'),
    image: '/images/geometriya-1.png',
  },
  {
    id: 3,
    link: '/portfolio#shortlyst',
    title: t('proj3_title'),
    task: t('proj3_task'),
    image: '/images/shortlyst-1.png',
  },
  {
    id: 4,
    link: '/portfolio#qr-cafe',
    title: t('proj4_title'),
    task: t('proj4_task'),
    image: '/images/qrcafe-1.png',
  },
]);

const updateActiveCard = (useHysteresis = true) => {
  if (isDesktop.value || !scrollContainer.value) return;

  const container = scrollContainer.value;
  const cards = container.children;
  if (!cards || !cards.length) return;

  const scrollLeft = container.scrollLeft;
  const maxScroll = container.scrollWidth - container.clientWidth;

  // Guarantee last card becomes active at the end of scroll
  if (maxScroll > 0 && scrollLeft >= maxScroll - 4) {
    activeMobileIndex.value = cards.length - 1;
    return;
  }

  const baseOffset = cards[0].offsetLeft;
  let closestIndex = 0;
  let minDistance = Infinity;

  for (let i = 0; i < cards.length; i++) {
    const targetScroll = cards[i].offsetLeft - baseOffset;
    const distance = Math.abs(scrollLeft - targetScroll);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  if (!useHysteresis) {
    if (activeMobileIndex.value !== closestIndex) {
      activeMobileIndex.value = closestIndex;
    }
    return;
  }

  if (closestIndex !== activeMobileIndex.value) {
    const currentCard = cards[activeMobileIndex.value];
    const currentTarget = currentCard ? currentCard.offsetLeft - baseOffset : 0;
    const step = cards.length > 1
      ? Math.max(1, cards[1].offsetLeft - baseOffset)
      : Math.max(1, container.clientWidth * 0.76);

    const progressFromCurrent = Math.abs(scrollLeft - currentTarget) / step;
    if (progressFromCurrent > 0.62) {
      activeMobileIndex.value = closestIndex;
    }
  }
};

const onCarouselScroll = () => {
  if (isDesktop.value || !scrollContainer.value) return;

  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      rafId = null;
      updateActiveCard(true);
    });
  }

  // Fallback for iOS Safari versions without scrollend event
  clearTimeout(scrollSettleTimer);
  scrollSettleTimer = setTimeout(() => {
    updateActiveCard(false);
  }, 120);
};

const onCarouselScrollEnd = () => {
  clearTimeout(scrollSettleTimer);
  updateActiveCard(false);
};

const syncViewport = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

// Ignore vertical resize events triggered by mobile browser toolbars
const handleResize = () => {
  const currentWidth = window.innerWidth;
  if (currentWidth === lastWidth) return;

  lastWidth = currentWidth;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isDesktop.value = currentWidth >= 1024;
    if (!isDesktop.value) {
      updateActiveCard(false);
    }
  }, 100);
};

onMounted(() => {
  lastWidth = window.innerWidth;
  syncViewport();
  window.addEventListener('resize', handleResize, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (rafId) cancelAnimationFrame(rafId);
  clearTimeout(scrollSettleTimer);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
/* Base section styles */
.projects-section {
  position: relative;
  background-color: transparent !important;
  padding: 150px 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-x: clip;
  isolation: isolate;
}

.ambient-glow {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  width: 1400px;
  height: 600px;
  background: radial-gradient(ellipse closest-side, rgba(255, 255, 255, 0.04) 0, transparent 100%);
  z-index: -1;
  pointer-events: none;
  will-change: transform;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Section header styles */
.section-header {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  width: 100%;
}

.kicker {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #98989d;
  margin: 0 -0.25em 0 0;
}

.gradient-title {
  font-size: clamp(32px, 4.5vw, 64px);
  font-weight: 500;
  letter-spacing: -0.04em;
  word-spacing: 0.14em;
  line-height: 1.2;
  white-space: nowrap;
  padding-bottom: 0.15em;
  padding-left: 0.25em;
  padding-right: 4px;
  max-width: 100%;
  margin: 0;
  background: linear-gradient(180deg, #ffffff 0%, #71717a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

/* Desktop staggered layout */
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

.desktop-grid .project-wrapper:nth-child(n + 2) {
  margin-top: -12%;
}

.desktop-grid .project-item {
  width: 100%;
  display: block;
  text-decoration: none;
  outline: none;
}

/* Card preview and shine effect */
.image-box {
  position: relative;
  overflow: hidden;
  background: #09090b;
  aspect-ratio: 16 / 10;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.image-box::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.12) 50%,
    transparent 55%
  );
  transform: translateX(-100%);
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
}

/* Project text details */
.project-info {
  margin-top: 35px;
  padding-left: 5px;
}

.project-info .name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: clamp(28px, 2.5vw, 36px);
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
  color: #f4f4f5;
  transition: color 0.4s ease;
}

.project-info .task-desc {
  font-size: 15px;
  line-height: 24px;
  color: #8a8a93;
  margin: 0;
  max-width: 90%;
  transition: color 0.4s ease;
}

/* Desktop hover overlay and button */
.project-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 10;
  pointer-events: none;
}

.btn-container {
  position: absolute;
  inset: 0;
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
  backdrop-filter: blur(0px);
  transform: translateY(30px) scale(0.9);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.3s ease,
              border-color 0.3s ease;
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
    transform: translateY(-8px);
  }

  .project-item:hover .image-box::after {
    transform: translateX(100%);
  }

  .project-item:hover .image-box img {
    transform: scale(1.06);
    filter: grayscale(0) brightness(1.05);
  }

  .project-item:hover .project-overlay {
    opacity: 1;
  }

  .project-item:hover .view-btn {
    opacity: 1;
    backdrop-filter: blur(12px);
    transform: translateY(0) scale(1);
    background: rgba(255, 255, 255, 0.12);
    will-change: transform, opacity;
  }

  .view-btn:hover {
    background: #ffffff !important;
    border-color: #ffffff !important;
  }

  .view-btn:hover .view-text,
  .view-btn:hover .view-arrow {
    color: #000000 !important;
  }

  .view-btn:hover .view-arrow {
    transform: translate3d(5px, 0, 0);
  }

  .project-item:hover .project-info .name {
    color: #ffffff;
  }

  .project-item:hover .project-info .task-desc {
    color: #b0b0b0;
  }
}

/* Mobile carousel hidden on desktop */
.projects-carousel {
  display: none;
}

/* Bottom "All cases" button */
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
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
    color: #000000 !important;
  }

  .btn-outline-platinum:hover .btn-flare {
    left: 150%;
    transition: left 0.7s;
  }
}

/* Laptop adjustments */
@media (min-width: 1024px) and (max-width: 1366px) {
  .desktop-grid .project-wrapper:nth-child(n + 2) {
    margin-top: -10%;
  }

  .project-info {
    margin-top: 30px;
  }

  .project-info .name {
    font-size: 32px;
  }
}

/* Tablet and mobile touch snap carousel */
@media (max-width: 1023px) {
  .ambient-glow,
  .desktop-grid,
  .project-overlay,
  .btn-container,
  .btn-flare {
    display: none !important;
  }

  .projects-carousel {
    display: block;
    width: calc(100% + 80px);
    margin-left: -40px;
    margin-right: -40px;
    padding-top: 10px;
    margin-top: clamp(28px, 5vw, 44px);
  }

  /* Do NOT use scroll-behavior: smooth with touch scroll-snap on iOS WebKit */
  .gpu-scroll {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    gap: 16px;
    padding: 0 20px;
    scroll-padding-left: 20px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    overscroll-behavior-x: contain;
  }

  .gpu-scroll::-webkit-scrollbar {
    display: none;
  }

  .projects-carousel .card-wrapper {
    flex: 0 0 76vw;
    width: 76vw;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  /* Use GPU-composited opacity + transform instead of filter: brightness() */
  .projects-carousel .project-item {
    display: block;
    width: 100%;
    text-decoration: none;
    outline: none;
    opacity: 0.4;
    transform: scale(0.9) translateZ(0);
    transform-origin: center top;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                opacity 0.35s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .projects-carousel .project-item.is-mobile-active {
    opacity: 1;
    transform: scale(1) translateZ(0);
  }

  .projects-carousel .image-box {
    aspect-ratio: 16 / 11;
    transform: translateZ(0);
    transition: border-color 0.35s ease;
  }

  .projects-carousel .project-item.is-mobile-active .image-box {
    border-color: rgba(255, 255, 255, 0.9);
  }

  .projects-carousel .image-box img {
    filter: none !important;
    transition: none;
  }

  .all-cases-action {
    margin-top: 50px;
  }
}

/* Phone adjustments */
@media (max-width: 767px) {
  .projects-section {
    padding: 80px 0 !important;
  }

  .container {
    padding: 0 14px;
  }

  .projects-carousel {
    width: calc(100% + 28px);
    margin-left: -14px;
    margin-right: -14px;
  }

  .section-header {
    margin-bottom: 32px;
    gap: 12px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4em;
    margin-right: -0.4em;
  }

  .gradient-title {
    font-size: clamp(28px, 8.2vw, 40px);
    letter-spacing: -0.055em;
    word-spacing: 0.04em;
    padding: 0 2px 0.15em;
  }

  .project-info {
    margin-top: 20px;
  }

  .project-info .name {
    font-size: 24px;
  }

  .project-info .task-desc {
    font-size: 13px;
    max-width: 100%;
  }

  .btn-outline-platinum {
    width: 100%;
    padding: 18px 0;
    font-size: 13px;
    min-height: 56px;
  }
}

/* Touch device active feedback */
@media (hover: none) {
  .btn-outline-platinum:active {
    background: #e5e4e2;
    border-color: #e5e4e2;
  }

  .btn-outline-platinum:active .text {
    color: #000000 !important;
  }
}
</style>