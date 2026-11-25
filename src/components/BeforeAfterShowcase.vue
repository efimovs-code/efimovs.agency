<template>
  <section class="ba-section">
    <div class="container">
      <div ref="headerRef" class="section-header">
        <span class="kicker">{{ t('ba_kicker') }}</span>
        <h2 ref="titleRef" class="gradient-title ba-single-title">
          {{ baTitle }}
        </h2>
        <p class="section-sub">
          {{ t('ba_sub_before') }}<span class="sub-highlight">{{ t('ba_sub_accent') }}</span>{{ t('ba_sub_after') }}
        </p>
      </div>
    </div>

    <!-- INTERACTIVE COMPARISON STAGE -->
    <div
      ref="stageRef"
      class="ba-stage-full"
      :class="{ dragging: isDragging }"
      :style="{ '--split': split + '%' }"
    >
      <!-- LAYER 1 (BASE): AFTER -->
      <div class="layer layer-after" aria-hidden="true">
        <img
          src="/images/after.jpg"
          alt="Modern high-converting website"
          class="site-screenshot"
          draggable="false"
          decoding="async"
        />
      </div>

      <!-- LAYER 2 (CLIPPED OVERLAY): BEFORE -->
      <div class="layer layer-before" aria-hidden="true">
        <img
          src="/images/before.jpg"
          alt="Outdated cluttered website"
          class="site-screenshot"
          draggable="false"
          decoding="async"
        />
      </div>

      <!-- DIVIDER LINE AND DRAG HANDLE -->
      <div class="divider-line">
        <div
          ref="handleRef"
          class="divider-handle"
          role="slider"
          tabindex="0"
          :aria-label="t('ba_aria_slider')"
          aria-valuemin="3"
          aria-valuemax="97"
          :aria-valuenow="Math.round(split)"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="stopDrag"
          @pointercancel="stopDrag"
          @keydown="onSliderKeydown"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 18L3 12L9 6M15 6L21 12L15 18"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- SECTION CTA -->
    <div class="container">
      <div class="section-cta-wrapper">
        <button
          type="button"
          class="main-action-btn"
          @click="$emit('open-contact')"
        >
          {{ t('ba_cta') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { t, currentLang } from '../composables/useLanguage.js';

defineEmits(['open-contact']);

const headerRef = ref(null);
const titleRef = ref(null);
const stageRef = ref(null);
const handleRef = ref(null);
const split = ref(50);
const isDragging = ref(false);

let resizeObserver = null;
let lastWidth = 0;
let activePointerId = null;
let dragOffsetX = 0;

const baTitle = computed(() => t('ba_title'));

// AUTO-SCALE HEADING FONT SIZE TO PREVENT LINE WRAPPING
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

// IGNORE VERTICAL RESIZE EVENTS TRIGGERED BY TELEGRAM TOOLBARS
const handleResize = () => {
  const currentWidth = window.innerWidth;
  if (currentWidth === lastWidth) return;

  lastWidth = currentWidth;
  fitTitle();
};

watch([baTitle, () => currentLang.value.code], () => {
  nextTick(fitTitle);
});

const clampSplit = (val) => Math.min(97, Math.max(3, val));

const updateFromClientX = (clientX) => {
  if (!stageRef.value) return;
  const rect = stageRef.value.getBoundingClientRect();
  if (!rect.width) return;
  const adjustedX = clientX - dragOffsetX;
  const pct = ((adjustedX - rect.left) / rect.width) * 100;
  split.value = clampSplit(pct);
};

const onPointerMove = (e) => {
  if (!isDragging.value) return;
  if (activePointerId !== null && e.pointerId !== activePointerId) return;
  updateFromClientX(e.clientX);
};

const stopDrag = (e) => {
  if (e && activePointerId !== null && e.pointerId !== undefined && e.pointerId !== activePointerId) {
    return;
  }

  if (handleRef.value && activePointerId !== null) {
    try {
      if (handleRef.value.hasPointerCapture?.(activePointerId)) {
        handleRef.value.releasePointerCapture(activePointerId);
      }
    } catch {
      // Ignore if pointer capture was already released by browser
    }
  }

  isDragging.value = false;
  activePointerId = null;
  dragOffsetX = 0;

  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', stopDrag);
  window.removeEventListener('pointercancel', stopDrag);
};

const onPointerDown = (e) => {
  if (e.button !== undefined && e.button !== 0) return;

  e.preventDefault();
  e.stopPropagation();

  activePointerId = e.pointerId ?? null;
  isDragging.value = true;

  // Keep relative finger offset inside the handle so it never jumps on initial touch
  if (handleRef.value) {
    const handleRect = handleRef.value.getBoundingClientRect();
    const handleCenterX = handleRect.left + handleRect.width / 2;
    dragOffsetX = e.clientX - handleCenterX;

    if (activePointerId !== null) {
      try {
        handleRef.value.setPointerCapture?.(activePointerId);
      } catch {
        // Fallback to window listeners below
      }
    }
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);
};

const onSliderKeydown = (e) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    split.value = clampSplit(split.value - 4);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    split.value = clampSplit(split.value + 4);
  }
};

onMounted(() => {
  lastWidth = window.innerWidth;
  fitTitle();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTitle);
  }
  if (typeof ResizeObserver !== 'undefined' && headerRef.value) {
    resizeObserver = new ResizeObserver(fitTitle);
    resizeObserver.observe(headerRef.value);
  }
  window.addEventListener('resize', handleResize, { passive: true });
});

onBeforeUnmount(() => {
  stopDrag();
  if (resizeObserver) resizeObserver.disconnect();
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.ba-section {
  position: relative;
  width: 100%;
  padding: 96px 0;
  box-sizing: border-box;
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
  box-sizing: border-box;
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

/* COMPARISON STAGE */
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
  cursor: default;
  background: #050505;
}

.ba-stage-full.dragging {
  cursor: grabbing;
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
  will-change: clip-path;
}

.site-screenshot {
  display: block;
  width: 100%;
  height: auto;
  margin-top: -3.2%;
}

/* DIVIDER LINE & HANDLE */
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
  will-change: left;
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
  pointer-events: auto;
  touch-action: none;
  cursor: grab;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.8),
    0 0 0 6px rgba(255, 255, 255, 0.2);
  transition: transform 0.15s ease;

  /* Slightly expanded invisible hit area strictly around the handle */
  &::after {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
  }

  &:focus-visible {
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.8),
      0 0 0 8px rgba(255, 255, 255, 0.45);
  }
}

.ba-stage-full.dragging .divider-handle {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.1);
}

/* SECTION CTA */
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

/* RESPONSIVE */
@media (max-width: 1023px) {
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