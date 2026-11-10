<template>
  <section class="roadmap-section" :class="{ 'tg-safe-mode': isTelegram }">
    <div class="container">
      
      <!-- 🌟 Заголовок секции (ИДЕНТИЧНЫЙ FAQ И PRICING) -->
      <div class="section-header">
        <div v-if="isDesktop && !isTelegram" class="ambient-glow" v-once></div>

        <span class="kicker">{{ t('roadmap_kicker') }}</span>
        
        <div class="title-scroll-wrapper">
          <h2 class="gradient-title">
            {{ t('roadmap_title_1') }} {{ t('roadmap_title_2') }}
          </h2>
        </div>
      </div>

      <!-- Сама линия и шаги -->
      <div class="timeline-wrapper">
        
        <!-- Линия трека -->
        <div class="timeline-track"></div>
        
        <!-- Ярко-белая лазерная линия прогресса -->
        <div class="timeline-progress">
          <div class="progress-glow"></div>
        </div>

        <!-- Сетка шагов -->
        <div class="steps-grid">
          
          <!-- Шаг 1 -->
          <div class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>
            <div class="step-content">
              <span class="step-number" v-once>01</span>
              <h3 class="step-title">{{ t('step1_title') }}</h3>
              <p class="step-desc">{{ t('step1_desc') }}</p>
            </div>
          </div>

          <!-- Шаг 2 -->
          <div class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>
            <div class="step-content">
              <span class="step-number" v-once>02</span>
              <h3 class="step-title">{{ t('step2_title') }}</h3>
              <p class="step-desc">{{ t('step2_desc') }}</p>
            </div>
          </div>

          <!-- Шаг 3 -->
          <div class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>
            <div class="step-content">
              <span class="step-number" v-once>03</span>
              <h3 class="step-title">{{ t('step3_title') }}</h3>
              <p class="step-desc">{{ t('step3_desc') }}</p>
            </div>
          </div>

          <!-- Шаг 4 -->
          <div class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>
            <div class="step-content">
              <span class="step-number" v-once>04</span>
              <h3 class="step-title">{{ t('step4_title') }}</h3>
              <p class="step-desc">{{ t('step4_desc') }}</p>
            </div>
          </div>

        </div>
      </div>
      
      <!-- 🌟 КНОПКА CALL-TO-ACTION (ТОЧНАЯ КОПИЯ ИЗ EXPERTISE.VUE) -->
      <div class="section-cta-wrapper">
        <button class="main-action-btn" @click="$emit('open-contact')">
          {{ t('btn_discuss') }}
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { t } from '../composables/useLanguage';

defineEmits(['open-contact']);

const isDesktop = ref(true);
const isTelegram = ref(false);
let resizeTimer = null;

const checkDevice = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isDesktop.value = window.innerWidth >= 1024;
  }, 100);
};

onMounted(() => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  if (/Telegram|FBAV|Instagram/i.test(ua)) {
    isTelegram.value = true;
  }
  checkDevice();
  window.addEventListener("resize", checkDevice, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDevice);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
.roadmap-section {
  position: relative;
  width: 100%;
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150px 0px;
  background: transparent;
  color: #ffffff;
  z-index: 10;
  contain: paint style;
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale; 
  text-rendering: optimizeLegibility;
}

.container {
  max-width: 1700px; 
  width: 100%;
  margin: 0px auto;
  padding: 0px 50px;
}

/* =========================================
   ЗАГОЛОВОК (КАК В FAQ / PRICING)
   ========================================= */
.section-header {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-bottom: 0px;
}

.title-scroll-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.gradient-title {
  font-size: 64px;
  font-weight: 500;
  margin: 0px;
  letter-spacing: -0.04em;
  line-height: 1.2;
  padding-bottom: 0.15em; /* Компенсация WebKit бага */
  padding-left: 0.25em; /* Оптическая компенсация для точки в конце */
  background: linear-gradient(180deg, #ffffff 0%, #71717a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  white-space: nowrap; /* Строго в одну строку для скролла */
}

/* =========================================
   ТАЙМЛАЙН И ЛАЗЕРНАЯ ЛИНИЯ
   ========================================= */
.timeline-wrapper {
  position: relative;
  width: 100%;
  margin-top: clamp(60px, 8vw, 88px);
}

.timeline-track {
  position: absolute;
  top: 12px;
  left: 0px;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.timeline-progress {
  position: absolute;
  top: 12px;
  left: 0px;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.8) 50%, #ffffff 100%);
  z-index: 2;
  opacity: 1;
}

.progress-glow {
  position: absolute;
  right: 0px;
  top: -3px; 
  width: 7px;
  height: 7px;
  background: #ffffff;
  border-radius: 50%;
  transform: translateX(50%) translateZ(0);
}

/* =========================================
   ШАГИ И УЗЛЫ
   ========================================= */
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
  opacity: 1;
  z-index: 2;
}

/* =========================================
   ТИПОГРАФИКА ШАГОВ
   ========================================= */
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
  margin: 0px 0px 16px 0px;
  color: #ffffff;
  letter-spacing: -0.5px;
  white-space: nowrap; 
}

.step-desc {
  font-size: 16px; 
  line-height: 26px;
  color: #e4e4e7;
  margin: 0px;
  font-weight: 400;
  letter-spacing: 0.2px;
}

/* =========================================
   СЕКЦИЯ КНОПКИ (ТОЧНАЯ КОПИЯ ИЗ EXPERTISE.VUE)
   ========================================= */
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

/* =========================================
   АДАПТИВНОСТЬ
   ========================================= */
@media (min-width: 1024px) and (max-width: 1200px) {
  .gradient-title { font-size: clamp(48px, 5vw, 56px); }
}

@media (max-width: 1199px) {
  .roadmap-section {
    min-height: auto;
    padding: 120px 0px;
  }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 80px;
  }
  
  .timeline-track, .timeline-progress {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .gradient-title {
    font-size: clamp(40px, 6vw, 54px) !important;
  }
}

@media (max-width: 767px) {
  .roadmap-section {
    padding: 80px 0px 100px 0px;
  }
  
  .container {
    padding: 0px 24px;
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
    margin-bottom: 0;
  }

  /* 🌟 Обертка для мобильного скролла */
  .title-scroll-wrapper {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    display: flex;
    justify-content: flex-start;
  }

  .title-scroll-wrapper::-webkit-scrollbar { display: none; }

  .title-scroll-wrapper::before,
  .title-scroll-wrapper::after {
    content: "";
    flex: 1 0 auto;
  }
  
  /* Идеальный адаптивный заголовок строго в одну строку */
  .gradient-title { 
    flex: 0 0 auto;
    font-size: clamp(24px, 7.5vw, 36px) !important; 
    padding: 0 16px 0.15em calc(16px + 0.25em) !important;
    letter-spacing: -0.02em !important;
  }

  .timeline-wrapper {
    margin-top: 32px;
  }

  .steps-grid {
    grid-template-columns: 1fr;
    gap: 0px;
  }

  .step-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 24px;
    padding-bottom: 50px;
    position: relative;
  }

  .step-item::before {
    content: '';
    position: absolute;
    left: 11px;
    top: 24px;
    bottom: 0px;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
  
  .step-item:last-child::before {
    display: none;
  }
  
  .step-item:last-child {
    padding-bottom: 0px;
  }

  .step-node {
    margin-bottom: 0px;
    flex-shrink: 0;
  }

  .step-content {
    padding-right: 0px;
    padding-top: 0px; 
  }

  .step-title {
    font-size: 26px;
    margin: 0px 0px 8px 0px; 
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