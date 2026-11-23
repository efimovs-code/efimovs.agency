<template>
  <section class="ba-section">
    <div class="container">
      <div ref="headerRef" class="section-header">
        <span class="kicker">{{ localized.kicker }}</span>
        <h2 ref="titleRef" class="gradient-title ba-single-title">
          {{ localized.title }}
        </h2>
        <p class="section-sub">
          {{ localized.subBefore }}<span class="sub-highlight">{{ localized.subAccent }}</span>{{ localized.subAfter }}
        </p>
      </div>
    </div>

    <!-- СЦЕНА СРАВНЕНИЯ СРЕДНЕГО РАЗМЕРА -->
    <div
      ref="stageRef"
      class="ba-stage-full"
      :class="{ dragging: isDragging }"
      :style="{ '--split': split + '%' }"
      @pointerdown="onPointerDown"
    >
      <!-- СЛОЙ 1 (БАЗОВЫЙ): ПОСЛЕ -->
      <div class="layer layer-after" aria-hidden="true">
        <img
          src="/images/after.jpg"
          alt="analogue.co"
          class="site-screenshot"
          draggable="false"
        />
      </div>

      <!-- СЛОЙ 2 (ВЕРХНИЙ, ОБРЕЗАЕТСЯ ПОЛЗУНКОМ): ДО -->
      <div class="layer layer-before" aria-hidden="true">
        <img
          src="/images/before.jpg"
          alt="berkshirehathaway.com"
          class="site-screenshot"
          draggable="false"
        />
      </div>

      <!-- ВЕРТИКАЛЬНАЯ ЛИНИЯ И РУЧКА ПОЛЗУНКА -->
      <div class="divider-line">
        <div
          class="divider-handle"
          role="slider"
          aria-label="Сравнить сайты до и после"
          :aria-valuenow="Math.round(split)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L3 12L9 6M15 6L21 12L15 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- КНОПКА В ТОЧНОСТИ КАК В Expertise.vue -->
    <div class="container">
      <div class="section-cta-wrapper">
        <button
          type="button"
          class="main-action-btn"
          @click="$emit('open-contact')"
        >
          {{ localized.cta }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { currentLang } from '../composables/useLanguage';

defineEmits(['open-contact']);

const langCode = computed(() => currentLang.value?.code || 'RU');

const contentDict = {
  RU: {
    kicker: 'СТАТИСТИКА GOOGLE',
    title: '75% закрывают неудобный сайт',
    subBefore: 'Люди уходят, если ',
    subAccent: 'не понимают, как купить',
    subAfter: '. Потяните ползунок и сравните.',
    cta: 'ОБНОВИТЬ МОЙ САЙТ'
  },
  UA: {
    kicker: 'СТАТИСТИКА GOOGLE',
    title: '75% закривають незручний сайт',
    subBefore: 'Люди йдуть, якщо ',
    subAccent: 'не розуміють, як купити',
    subAfter: '. Потягніть повзунок і порівняйте.',
    cta: 'ОНОВИТИ МІЙ САЙТ'
  },
  EN: {
    kicker: 'GOOGLE DATA',
    title: '75% leave a clunky site',
    subBefore: 'Visitors drop off when ',
    subAccent: 'buying feels unclear',
    subAfter: '. Drag the slider to compare.',
    cta: 'UPGRADE MY WEBSITE'
  }
};

const localized = computed(() => contentDict[langCode.value] || contentDict.EN);

const headerRef = ref(null);
const titleRef = ref(null);
const stageRef = ref(null);
const split = ref(50);
const isDragging = ref(false);
let resizeObserver = null;

const fitTitle = () => {
  const el = titleRef.value;
  const wrap = headerRef.value;
  if (!el || !wrap) return;

  el.style.fontSize = '';
  const maxWidth = wrap.clientWidth;
  if (!maxWidth) return;

  let currentSize = parseFloat(window.getComputedStyle(el).fontSize);
  const minSize = 18;

  while (el.scrollWidth > maxWidth && currentSize > minSize) {
    currentSize -= 0.5;
    el.style.fontSize = `${currentSize}px`;
  }
};

watch(() => localized.value.title, () => {
  nextTick(fitTitle);
});

const clampSplit = (val) => Math.min(97, Math.max(3, val));

const updateFromClientX = (clientX) => {
  if (!stageRef.value) return;
  const rect = stageRef.value.getBoundingClientRect();
  if (!rect.width) return;
  const pct = ((clientX - rect.left) / rect.width) * 100;
  split.value = clampSplit(pct);
};

const onPointerMove = (e) => {
  if (!isDragging.value) return;
  updateFromClientX(e.clientX);
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', stopDrag);
  window.removeEventListener('pointercancel', stopDrag);
};

const onPointerDown = (e) => {
  isDragging.value = true;
  updateFromClientX(e.clientX);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);
};

onMounted(() => {
  fitTitle();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTitle);
  }
  if (typeof ResizeObserver !== 'undefined' && headerRef.value) {
    resizeObserver = new ResizeObserver(fitTitle);
    resizeObserver.observe(headerRef.value);
  }
  window.addEventListener('resize', fitTitle, { passive: true });
});

onBeforeUnmount(() => {
  stopDrag();
  if (resizeObserver) resizeObserver.disconnect();
  window.removeEventListener('resize', fitTitle);
});
</script>

<style lang="scss" scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.ba-section {
  position: relative;
  width: 100%;
  padding: 96px 0;
  font-family: "Plus Jakarta Sans", sans-serif;
  color: #fff;
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 2;
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  margin: 0 auto 38px;
}

.ba-single-title {
  white-space: nowrap;
  max-width: 100%;
  padding-inline: 4px;
  letter-spacing: -0.03em;
}

.section-sub {
  margin: 14px 0 0;
  max-width: 680px;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.55);
}

.sub-highlight {
  color: #ffffff;
  font-weight: 500;
}

/* СЦЕНА СРЕДНЕГО КОМФОРТНОГО РАЗМЕРА НА ДЕСКТОПЕ */
.ba-stage-full {
  position: relative;
  width: calc(100% - 48px);
  max-width: 1080px;
  margin: 0 auto;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.85);
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  cursor: ew-resize;
  background: #050505;
}

.layer-after {
  position: relative;
  width: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.layer-before {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
  clip-path: inset(0 calc(100% - var(--split)) 0 0);
}

.site-screenshot {
  display: block;
  width: 100%;
  height: auto;
  margin-top: -3.2%;
}

/* Линия разделителя */
.divider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--split);
  width: 2px;
  background: #ffffff;
  box-shadow: 0 0 24px rgba(255, 255, 255, 0.85);
  z-index: 10;
  transform: translateX(-50%);
  pointer-events: none;
}

.divider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #ffffff;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8), 0 0 0 6px rgba(255, 255, 255, 0.2);
  transition: transform 0.15s ease;
}

.ba-stage-full.dragging .divider-handle {
  transform: translate(-50%, -50%) scale(1.1);
}

/* --- СТИЛИ КНОПКИ В ТОЧНОСТИ КАК В Expertise.vue --- */
.section-cta-wrapper {
  margin-top: clamp(40px, 5vw, 60px);
  display: flex;
  justify-content: center;
  width: 100%;
}

.main-action-btn {
  background-color: #E6E6E6;
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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #ffffff;
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

/* Адаптив */
@media (max-width: 1024px) {
  .ba-section {
    padding: 72px 0;
  }

  .container {
    padding: 0 24px;
  }

  .section-header {
    margin-bottom: 28px;
  }

  .ba-stage-full {
    width: calc(100% - 32px);
    border-radius: 18px;
  }
}

@media (max-width: 767px) {
  .ba-section {
    padding: 52px 0;
  }

  .container {
    padding: 0 14px;
  }

  .section-header {
    margin-bottom: 20px;
  }

  .section-sub {
    font-size: 14px;
    line-height: 1.45;
    margin-top: 10px;
  }

  .ba-stage-full {
    width: calc(100% - 16px);
    border-radius: 14px;
  }

  .divider-handle {
    width: 40px;
    height: 40px;
  }

  .main-action-btn {
    width: 100%;
    padding: 20px 24px;
    font-size: 14px;
  }
}
</style>