<template>
  <section class="roadmap-section" :class="{ 'tg-safe-mode': isTelegram }">
    <div class="container">

      <!-- --- SECTION HEADER -->
      <div ref="headerRef" class="section-header">
        <div v-if="!isTelegram" class="ambient-glow" v-once></div>

        <span class="kicker">{{ t('roadmap_kicker') }}</span>
        <h2 ref="titleRef" class="gradient-title">
          {{ roadmapTitle }}
        </h2>
      </div>

      <!-- --- TIMELINE & STEPS -->
      <div class="timeline-wrapper">
        <div class="timeline-track"></div>

        <div class="timeline-progress">
          <div class="progress-glow"></div>
        </div>

        <div class="steps-grid">
          <div v-for="step in steps" :key="step.number" class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>

            <div class="step-content">
              <span class="step-number">{{ step.number }}</span>
              <h3 class="step-title">{{ t(step.titleKey) }}</h3>
              <p class="step-desc">{{ t(step.descKey) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- --- CALL TO ACTION BUTTON -->
      <div class="section-cta-wrapper">
        <button type="button" class="main-action-btn" @click="$emit('open-contact')">
          {{ t('btn_discuss') }}
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { t, currentLang } from '../composables/useLanguage';

// --- EMITS
defineEmits(['open-contact']);

// --- STATIC DATA
const steps = [
  { number: '01', titleKey: 'step1_title', descKey: 'step1_desc' },
  { number: '02', titleKey: 'step2_title', descKey: 'step2_desc' },
  { number: '03', titleKey: 'step3_title', descKey: 'step3_desc' },
  { number: '04', titleKey: 'step4_title', descKey: 'step4_desc' },
];

// --- DETECT IN-APP BROWSERS ONCE
const isTelegram =
  typeof navigator !== 'undefined' &&
  /Telegram|FBAV|Instagram/i.test(navigator.userAgent || '');

// --- DOM REFS
const headerRef = ref(null);
const titleRef = ref(null);
let resizeObserver = null;

// --- FULL SECTION TITLE
const roadmapTitle = computed(() => {
  return `${t('roadmap_title_1') || ''} ${t('roadmap_title_2') || ''}`.trim();
});

// --- FIT SINGLE-LINE TITLE TO CONTAINER WIDTH
const fitTitle = () => {
  const titleEl = titleRef.value;
  const headerEl = headerRef.value;
  if (!titleEl || !headerEl) return;

  titleEl.style.fontSize = '';
  const maxWidth = headerEl.clientWidth;
  if (!maxWidth) return;

  let currentSize = parseFloat(window.getComputedStyle(titleEl).fontSize);
  const minSize = 18;

  while (titleEl.scrollWidth > maxWidth && currentSize > minSize) {
    currentSize -= 0.5;
    titleEl.style.fontSize = `${currentSize}px`;
  }
};

// --- RECALCULATE TITLE SIZE ON LANGUAGE CHANGE
watch([roadmapTitle, () => currentLang.value?.code], () => {
  nextTick(fitTitle);
});

// --- LIFECYCLE
onMounted(() => {
  fitTitle();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTitle);
  }

  if (typeof ResizeObserver !== 'undefined' && headerRef.value) {
    resizeObserver = new ResizeObserver(fitTitle);
    resizeObserver.observe(headerRef.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
/* --- BASE LAYOUT */
.roadmap-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150px 0;
  background: transparent;
  color: #ffffff;
  z-index: 10;
  contain: style;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.container {
  max-width: 1700px;
  width: 100%;
  margin: 0 auto;
  padding: 0 50px;
}

/* --- SECTION HEADER */
.section-header {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
  gap: 16px;
}

.ambient-glow {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0);
  width: 650px;
  height: 250px;
  background: radial-gradient(ellipse closest-side, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
  z-index: -1;
  pointer-events: none;
}

.kicker {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #a1a1aa;
  margin-bottom: 0;
}

.gradient-title {
  font-size: 64px;
  font-weight: 500;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 1.2;
  padding: 0 4px 0.15em 0.25em;
  max-width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #71717a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}

/* --- TIMELINE & PROGRESS LINE */
.timeline-wrapper {
  position: relative;
  width: 100%;
  margin-top: clamp(60px, 8vw, 88px);
}

.timeline-track {
  position: absolute;
  top: 12px;
  left: 0;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.timeline-progress {
  position: absolute;
  top: 12px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.8) 50%, #ffffff 100%);
  z-index: 2;
}

.progress-glow {
  position: absolute;
  right: 0;
  top: -3px;
  width: 7px;
  height: 7px;
  background: #ffffff;
  border-radius: 50%;
  transform: translateX(50%) translateZ(0);
}

/* --- STEPS GRID & NODES */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 60px;
  position: relative;
  z-index: 3;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.step-node {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.node-core {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #ffffff;
  transform: scale(1) translateZ(0);
  z-index: 2;
}

/* --- STEP TYPOGRAPHY */
.step-content {
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  width: 100%;
}

.step-number {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  font-family: monospace;
}

.step-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #ffffff;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.step-desc {
  font-size: 16px;
  line-height: 26px;
  color: #e4e4e7;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.2px;
}

/* --- CTA BUTTON */
.section-cta-wrapper {
  margin-top: clamp(40px, 5vw, 60px);
  display: flex;
  justify-content: center;
  width: 100%;
}

.main-action-btn {
  background-color: #e6e6e6;
  color: #050505;
  border: none;
  border-radius: 100px;
  padding: 24px 80px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

@media (hover: hover) and (pointer: fine) {
  .main-action-btn:hover {
    background-color: #ffffff;
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
  }
}

.main-action-btn:active {
  transform: scale(0.98);
}

/* --- RESPONSIVE BREAKPOINTS */
@media (min-width: 1024px) and (max-width: 1200px) {
  .gradient-title {
    font-size: clamp(48px, 5vw, 56px);
  }
}

@media (max-width: 1199px) {
  .roadmap-section {
    min-height: auto;
    padding: 120px 0;
  }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 80px;
  }

  .timeline-track,
  .timeline-progress {
    display: none;
  }
}

@media (max-width: 1023px) {
  .ambient-glow {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .gradient-title {
    font-size: clamp(40px, 6vw, 54px);
  }
}

@media (max-width: 767px) {
  .roadmap-section {
    padding: 80px 0 100px 0;
  }

  .container {
    padding: 0 16px;
  }

  .section-header {
    margin-bottom: 24px;
    gap: 12px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.45em;
    margin-right: -0.45em;
  }

  .gradient-title {
    font-size: clamp(28px, 8vw, 40px);
    padding: 0 4px 0.15em calc(4px + 0.25em);
  }

  .timeline-wrapper {
    margin-top: 32px;
  }

  .steps-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .step-item {
    flex-direction: row;
    gap: 24px;
    padding-bottom: 50px;
    position: relative;
  }

  .step-item::before {
    content: '';
    position: absolute;
    left: 11px;
    top: 24px;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }

  .step-item:last-child::before {
    display: none;
  }

  .step-item:last-child {
    padding-bottom: 0;
  }

  .step-node {
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .step-content {
    padding-right: 0;
  }

  .step-title {
    margin: 0 0 8px 0;
    white-space: normal;
  }

  .step-desc {
    font-size: 15px;
    line-height: 24px;
  }

  .section-cta-wrapper {
    margin-top: 40px;
  }

  .main-action-btn {
    width: 100%;
    padding: 20px 24px;
    font-size: 14px;
  }
}
</style>